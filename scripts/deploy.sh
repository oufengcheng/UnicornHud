#!/bin/bash

# Unicorn100平台自动化部署脚本
# 支持生产环境的完整部署流程

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 配置变量
APP_NAME="unicorn100-frontend"
VERSION=${1:-"latest"}
ENVIRONMENT=${2:-"production"}
DEPLOY_DIR="/opt/unicorn100"
BACKUP_DIR="/opt/unicorn100/backups"
LOG_DIR="/var/log/unicorn100"

# 检查必要的环境变量
check_environment() {
    log_info "检查环境变量..."
    
    required_vars=(
        "DB_HOST"
        "DB_NAME" 
        "DB_USER"
        "DB_PASSWORD"
        "REDIS_HOST"
        "API_BASE_URL"
        "STRIPE_PUBLIC_KEY"
        "SENDGRID_API_KEY"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "缺少必要的环境变量: ${missing_vars[*]}"
        exit 1
    fi
    
    log_success "环境变量检查通过"
}

# 检查系统依赖
check_dependencies() {
    log_info "检查系统依赖..."
    
    dependencies=("docker" "docker-compose" "nginx" "certbot")
    
    for dep in "${dependencies[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            log_error "缺少依赖: $dep"
            exit 1
        fi
    done
    
    log_success "系统依赖检查通过"
}

# 创建必要的目录
create_directories() {
    log_info "创建部署目录..."
    
    directories=(
        "$DEPLOY_DIR"
        "$BACKUP_DIR"
        "$LOG_DIR"
        "$DEPLOY_DIR/nginx"
        "$DEPLOY_DIR/ssl"
        "$DEPLOY_DIR/data"
    )
    
    for dir in "${directories[@]}"; do
        sudo mkdir -p "$dir"
        sudo chown -R $USER:$USER "$dir"
    done
    
    log_success "目录创建完成"
}

# 备份当前版本
backup_current_version() {
    log_info "备份当前版本..."
    
    if [[ -d "$DEPLOY_DIR/current" ]]; then
        backup_name="backup-$(date +%Y%m%d-%H%M%S)"
        sudo cp -r "$DEPLOY_DIR/current" "$BACKUP_DIR/$backup_name"
        log_success "当前版本已备份到: $BACKUP_DIR/$backup_name"
    else
        log_warning "没有找到当前版本，跳过备份"
    fi
}

# 下载新版本
download_version() {
    log_info "下载版本: $VERSION..."
    
    # 创建临时目录
    temp_dir=$(mktemp -d)
    cd "$temp_dir"
    
    # 这里应该从你的镜像仓库下载
    # 示例：从Docker Hub下载
    docker pull "unicorn100/frontend:$VERSION"
    
    # 或者从Git仓库下载
    # git clone --branch "$VERSION" https://github.com/unicorn100/frontend.git
    
    log_success "版本下载完成"
}

# 健康检查
health_check() {
    local url=$1
    local max_attempts=${2:-30}
    local attempt=1
    
    log_info "执行健康检查: $url"
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -f -s "$url/health" > /dev/null; then
            log_success "健康检查通过"
            return 0
        fi
        
        log_info "健康检查失败，重试 $attempt/$max_attempts..."
        sleep 2
        ((attempt++))
    done
    
    log_error "健康检查失败"
    return 1
}

# 部署应用
deploy_application() {
    log_info "部署应用..."
    
    # 停止当前服务
    if docker-compose -f "$DEPLOY_DIR/docker-compose.yml" ps | grep -q "Up"; then
        log_info "停止当前服务..."
        docker-compose -f "$DEPLOY_DIR/docker-compose.yml" down
    fi
    
    # 复制新版本
    sudo cp -r dist/* "$DEPLOY_DIR/current/"
    
    # 生成Docker Compose配置
    generate_docker_compose
    
    # 启动新服务
    log_info "启动新服务..."
    docker-compose -f "$DEPLOY_DIR/docker-compose.yml" up -d
    
    # 等待服务启动
    sleep 10
    
    # 健康检查
    if health_check "http://localhost:3000"; then
        log_success "应用部署成功"
    else
        log_error "应用部署失败，开始回滚..."
        rollback
        exit 1
    fi
}

# 生成Docker Compose配置
generate_docker_compose() {
    log_info "生成Docker Compose配置..."
    
    cat > "$DEPLOY_DIR/docker-compose.yml" << EOF
version: '3.8'

services:
  frontend:
    image: unicorn100/frontend:$VERSION
    container_name: unicorn100-frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=$DB_HOST
      - DB_NAME=$DB_NAME
      - DB_USER=$DB_USER
      - DB_PASSWORD=$DB_PASSWORD
      - REDIS_HOST=$REDIS_HOST
      - API_BASE_URL=$API_BASE_URL
      - STRIPE_PUBLIC_KEY=$STRIPE_PUBLIC_KEY
      - SENDGRID_API_KEY=$SENDGRID_API_KEY
    volumes:
      - $LOG_DIR:/app/logs
      - $DEPLOY_DIR/data:/app/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - unicorn100-network

  nginx:
    image: nginx:alpine
    container_name: unicorn100-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - $DEPLOY_DIR/nginx/nginx.conf:/etc/nginx/nginx.conf
      - $DEPLOY_DIR/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
    restart: unless-stopped
    networks:
      - unicorn100-network

  redis:
    image: redis:alpine
    container_name: unicorn100-redis
    ports:
      - "6379:6379"
    volumes:
      - $DEPLOY_DIR/data/redis:/data
    restart: unless-stopped
    networks:
      - unicorn100-network

networks:
  unicorn100-network:
    driver: bridge
EOF
    
    log_success "Docker Compose配置生成完成"
}

# 配置Nginx
configure_nginx() {
    log_info "配置Nginx..."
    
    cat > "$DEPLOY_DIR/nginx/nginx.conf" << EOF
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # HTTP重定向到HTTPS
    server {
        listen 80;
        server_name unicorn100.com www.unicorn100.com;
        return 301 https://\$server_name\$request_uri;
    }
    
    # HTTPS服务器
    server {
        listen 443 ssl http2;
        server_name unicorn100.com www.unicorn100.com;
        
        # SSL配置
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        
        # HSTS
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
        
        # 静态文件缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            proxy_pass http://frontend;
        }
        
        # API代理
        location /api/ {
            proxy_pass http://frontend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
        
        # 主应用
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            
            # WebSocket支持
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
EOF
    
    log_success "Nginx配置完成"
}

# 配置SSL证书
configure_ssl() {
    log_info "配置SSL证书..."
    
    if [[ ! -f "$DEPLOY_DIR/ssl/cert.pem" ]]; then
        log_info "生成SSL证书..."
        
        # 使用Let's Encrypt生成证书
        sudo certbot certonly --standalone \
            --email admin@unicorn100.com \
            --agree-tos \
            --no-eff-email \
            -d unicorn100.com \
            -d www.unicorn100.com
        
        # 复制证书到部署目录
        sudo cp /etc/letsencrypt/live/unicorn100.com/fullchain.pem "$DEPLOY_DIR/ssl/cert.pem"
        sudo cp /etc/letsencrypt/live/unicorn100.com/privkey.pem "$DEPLOY_DIR/ssl/key.pem"
        
        # 设置证书自动续期
        echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
        
        log_success "SSL证书配置完成"
    else
        log_info "SSL证书已存在，跳过生成"
    fi
}

# 配置监控
configure_monitoring() {
    log_info "配置监控系统..."
    
    # 创建监控配置
    cat > "$DEPLOY_DIR/monitoring.yml" << EOF
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    container_name: unicorn100-prometheus
    ports:
      - "9090:9090"
    volumes:
      - $DEPLOY_DIR/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - $DEPLOY_DIR/data/prometheus:/prometheus
    restart: unless-stopped
    networks:
      - unicorn100-network

  grafana:
    image: grafana/grafana
    container_name: unicorn100-grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - $DEPLOY_DIR/data/grafana:/var/lib/grafana
    restart: unless-stopped
    networks:
      - unicorn100-network

networks:
  unicorn100-network:
    external: true
EOF
    
    # 启动监控服务
    docker-compose -f "$DEPLOY_DIR/monitoring.yml" up -d
    
    log_success "监控系统配置完成"
}

# 回滚函数
rollback() {
    log_warning "开始回滚到上一个版本..."
    
    # 查找最新的备份
    latest_backup=$(ls -t "$BACKUP_DIR" | head -n1)
    
    if [[ -n "$latest_backup" ]]; then
        log_info "回滚到备份: $latest_backup"
        
        # 停止当前服务
        docker-compose -f "$DEPLOY_DIR/docker-compose.yml" down
        
        # 恢复备份
        sudo rm -rf "$DEPLOY_DIR/current"
        sudo cp -r "$BACKUP_DIR/$latest_backup" "$DEPLOY_DIR/current"
        
        # 重启服务
        docker-compose -f "$DEPLOY_DIR/docker-compose.yml" up -d
        
        # 健康检查
        if health_check "http://localhost:3000"; then
            log_success "回滚成功"
        else
            log_error "回滚失败"
            exit 1
        fi
    else
        log_error "没有找到备份文件，无法回滚"
        exit 1
    fi
}

# 清理旧备份
cleanup_old_backups() {
    log_info "清理旧备份..."
    
    # 保留最近7个备份
    cd "$BACKUP_DIR"
    ls -t | tail -n +8 | xargs -r rm -rf
    
    log_success "旧备份清理完成"
}

# 发送部署通知
send_notification() {
    local status=$1
    local message=$2
    
    log_info "发送部署通知..."
    
    # 发送邮件通知
    if command -v mail &> /dev/null; then
        echo "$message" | mail -s "Unicorn100 部署通知: $status" admin@unicorn100.com
    fi
    
    # 发送Slack通知（如果配置了webhook）
    if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"Unicorn100 部署通知: $status\\n$message\"}" \
            "$SLACK_WEBHOOK_URL"
    fi
    
    log_success "部署通知发送完成"
}

# 主部署流程
main() {
    log_info "开始Unicorn100平台部署..."
    log_info "版本: $VERSION"
    log_info "环境: $ENVIRONMENT"
    
    # 检查环境
    check_environment
    check_dependencies
    
    # 准备部署
    create_directories
    backup_current_version
    
    # 下载和部署
    download_version
    configure_nginx
    configure_ssl
    deploy_application
    
    # 配置监控
    configure_monitoring
    
    # 清理
    cleanup_old_backups
    
    # 发送通知
    send_notification "SUCCESS" "Unicorn100平台版本 $VERSION 部署成功"
    
    log_success "Unicorn100平台部署完成！"
    log_info "应用地址: https://unicorn100.com"
    log_info "监控地址: http://localhost:3001"
}

# 错误处理
trap 'log_error "部署过程中发生错误"; send_notification "FAILED" "Unicorn100平台部署失败"; exit 1' ERR

# 执行主流程
main "$@"

