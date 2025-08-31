# Unicorn 100 - Setup Instructions

This guide will help you set up the Unicorn 100 platform locally for development or presentation.

## 🎯 Quick Setup (5 minutes)

### Step 1: Prerequisites Check
Ensure you have the following installed:

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Optional: Install pnpm for faster package management
npm install -g pnpm
```

### Step 2: Install Dependencies

```bash
# Navigate to project directory
cd unicorn100-presentation

# Install dependencies (choose one)
npm install
# OR
pnpm install
```

### Step 3: Start Development Server

```bash
# Start the development server
npm run dev
# OR
pnpm dev
```

### Step 4: Open in Browser
The application will automatically open at `http://localhost:5173`

**🎉 That's it! The platform is now running locally.**

## 🔧 Detailed Setup

### Environment Configuration

1. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

2. **Edit environment variables** (optional)
   ```bash
   # Edit .env file with your preferred settings
   nano .env
   ```

### Development Tools Setup

1. **VS Code Extensions** (recommended)
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - Auto Rename Tag
   - Bracket Pair Colorizer
   - GitLens

2. **Browser Extensions** (for development)
   - React Developer Tools
   - Redux DevTools (if using Redux)

### Project Structure Verification

After setup, your project should look like this:

```
unicorn100-presentation/
├── 📁 public/
├── 📁 src/
│   ├── 📁 components/
│   ├── 📁 pages/
│   ├── 📁 services/
│   ├── 📁 hooks/
│   ├── 📁 i18n/
│   ├── 📁 styles/
│   └── 📄 App.jsx
├── 📄 package.json
├── 📄 vite.config.js
├── 📄 README.md
└── 📄 .env
```

## 🌐 Testing the Platform

### Demo Accounts
Use these accounts to test different user roles:

**Investor Account:**
- Email: `investor@demo.com`
- Password: `demo123`

**Founder Account:**
- Email: `founder@demo.com`
- Password: `demo123`

### Key Features to Test

1. **Homepage** - Landing page with features overview
2. **Projects** - Browse and analyze startup projects
3. **Investment** - Paper trading and portfolio management
4. **AI Analysis** - Intelligent project evaluation
5. **Market Data** - Real-time market insights
6. **Profile** - User account management
7. **Language Switching** - Multi-language support
8. **Mobile Experience** - Responsive design testing

### Mobile Testing

1. **Chrome DevTools**
   - Press F12 → Toggle device toolbar
   - Test different screen sizes
   - Simulate touch interactions

2. **Real Device Testing**
   - Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Access via `http://YOUR_IP:5173` on mobile device

## 🚀 Production Build

### Build for Production
```bash
# Create production build
npm run build
# OR
pnpm build
```

### Preview Production Build
```bash
# Preview the production build locally
npm run preview
# OR
pnpm preview
```

### Build Output
The production build will be created in the `dist/` folder:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── [static files]
```

## 🔍 Troubleshooting

### Common Issues

**1. Port 5173 already in use**
```bash
# Kill process using port 5173
npx kill-port 5173
# OR start on different port
npm run dev -- --port 3000
```

**2. Node modules issues**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**3. Build errors**
```bash
# Clear Vite cache
npx vite --force
# OR
rm -rf node_modules/.vite
```

**4. Permission errors (Linux/Mac)**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

### Performance Issues

**1. Slow development server**
```bash
# Use pnpm instead of npm
npm install -g pnpm
pnpm install
pnpm dev
```

**2. Large bundle size**
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

## 📱 Mobile Development

### Testing on Mobile Devices

1. **Find your local IP address**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig | grep inet
   ```

2. **Access from mobile device**
   ```
   http://YOUR_IP_ADDRESS:5173
   ```

3. **Enable mobile debugging**
   - Chrome: `chrome://inspect`
   - Safari: Develop menu → Device

### Mobile-Specific Features

- **Touch Gestures**: Swipe, pinch, long-press
- **Haptic Feedback**: Vibration on interactions
- **Pull-to-Refresh**: Native mobile behavior
- **Bottom Navigation**: Thumb-friendly navigation
- **Responsive Design**: Adapts to all screen sizes

## 🎨 Customization

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Located in `src/styles/`
- **Component Styles**: Inline with Tailwind classes

### Theming
- **Colors**: Modify in `tailwind.config.js`
- **Fonts**: Update in `src/styles/globals.css`
- **Layout**: Customize in `src/components/Layout.jsx`

### Adding New Features

1. **New Component**
   ```bash
   # Create component file
   touch src/components/NewComponent.jsx
   ```

2. **New Page**
   ```bash
   # Create page file
   touch src/pages/NewPage.jsx
   # Add route in src/App.jsx
   ```

3. **New Service**
   ```bash
   # Create service file
   touch src/services/newService.js
   ```

## 📊 Monitoring & Analytics

### Development Monitoring
- **Console Logs**: Check browser console for errors
- **Network Tab**: Monitor API calls and performance
- **React DevTools**: Inspect component state and props

### Performance Monitoring
```bash
# Lighthouse audit
npm install -g lighthouse
lighthouse http://localhost:5173 --view
```

## 🔐 Security Considerations

### Development Security
- **Environment Variables**: Never commit `.env` files
- **API Keys**: Use environment variables for sensitive data
- **HTTPS**: Use HTTPS in production
- **Input Validation**: Sanitize all user inputs

### Production Security
- **Content Security Policy**: Configured in build
- **XSS Protection**: Built-in React protections
- **HTTPS Only**: Enforce secure connections
- **Regular Updates**: Keep dependencies updated

## 📞 Support

### Getting Help

1. **Documentation**: Check README.md and inline comments
2. **Console Errors**: Check browser developer tools
3. **Network Issues**: Verify API endpoints and CORS
4. **Build Issues**: Clear cache and reinstall dependencies

### Useful Commands

```bash
# Check project health
npm audit

# Update dependencies
npm update

# Clear all caches
npm run clean

# Run tests
npm test

# Lint code
npm run lint
```

---

**Happy Coding! 🚀**

If you encounter any issues, please check the troubleshooting section or create an issue in the repository.

