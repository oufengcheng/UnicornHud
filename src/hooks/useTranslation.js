import { useState, useEffect } from 'react';
import i18n from '../i18n';

/**
 * 国际化React Hook
 * 提供翻译函数和语言状态管理
 */
export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.getCurrentLanguage());

  useEffect(() => {
    // 监听语言变化
    const unsubscribe = i18n.addListener((newLanguage) => {
      setCurrentLanguage(newLanguage);
    });

    return unsubscribe;
  }, []);

  // 翻译函数
  const t = (key, params = {}) => {
    return i18n.t(key, params);
  };

  // 切换语言
  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  // 获取当前语言信息
  const getCurrentLanguageInfo = () => {
    return i18n.getCurrentLanguageInfo();
  };

  // 获取支持的语言列表
  const getSupportedLanguages = () => {
    return i18n.getSupportedLanguages();
  };

  // 格式化函数
  const formatCurrency = (amount, currency = 'USD') => {
    return i18n.formatCurrency(amount, currency);
  };

  const formatNumber = (number, options = {}) => {
    return i18n.formatNumber(number, options);
  };

  const formatDate = (date, options = {}) => {
    return i18n.formatDate(date, options);
  };

  const formatRelativeTime = (date) => {
    return i18n.formatRelativeTime(date);
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    getCurrentLanguageInfo,
    getSupportedLanguages,
    formatCurrency,
    formatNumber,
    formatDate,
    formatRelativeTime
  };
};

/**
 * 语言检测Hook
 * 检测用户的语言偏好
 */
export const useLanguageDetection = () => {
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    const detectLanguage = async () => {
      try {
        // 检测浏览器语言
        const browserLanguage = navigator.language || navigator.userLanguage;
        
        // 检测地理位置（如果用户允许）
        let geoLanguage = null;
        if ('geolocation' in navigator) {
          try {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 5000,
                enableHighAccuracy: false
              });
            });
            
            // 根据地理位置推断语言（简化实现）
            const { latitude, longitude } = position.coords;
            geoLanguage = inferLanguageFromLocation(latitude, longitude);
          } catch (error) {
            console.log('Geolocation not available or denied');
          }
        }

        // 检测时区
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timezoneLanguage = inferLanguageFromTimezone(timezone);

        setDetectedLanguage({
          browser: browserLanguage,
          geo: geoLanguage,
          timezone: timezoneLanguage,
          recommended: geoLanguage || timezoneLanguage || browserLanguage
        });
      } catch (error) {
        console.error('Language detection failed:', error);
        setDetectedLanguage({
          browser: navigator.language || 'en-US',
          recommended: navigator.language || 'en-US'
        });
      } finally {
        setIsDetecting(false);
      }
    };

    detectLanguage();
  }, []);

  return { detectedLanguage, isDetecting };
};

/**
 * RTL支持Hook
 * 处理从右到左的语言布局
 */
export const useRTL = () => {
  const { currentLanguage, getCurrentLanguageInfo } = useTranslation();
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const languageInfo = getCurrentLanguageInfo();
    const rtl = languageInfo?.rtl || false;
    setIsRTL(rtl);

    // 更新HTML dir属性
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    
    // 添加RTL类到body
    if (rtl) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [currentLanguage, getCurrentLanguageInfo]);

  return { isRTL };
};

/**
 * 本地化格式Hook
 * 提供本地化的数字、日期、货币格式
 */
export const useLocalization = () => {
  const { currentLanguage } = useTranslation();

  const formatters = {
    // 货币格式化器
    currency: (amount, currency = 'USD', options = {}) => {
      try {
        return new Intl.NumberFormat(currentLanguage, {
          style: 'currency',
          currency,
          ...options
        }).format(amount);
      } catch (error) {
        return `${currency} ${amount.toLocaleString()}`;
      }
    },

    // 数字格式化器
    number: (number, options = {}) => {
      try {
        return new Intl.NumberFormat(currentLanguage, options).format(number);
      } catch (error) {
        return number.toLocaleString();
      }
    },

    // 百分比格式化器
    percent: (value, options = {}) => {
      try {
        return new Intl.NumberFormat(currentLanguage, {
          style: 'percent',
          ...options
        }).format(value);
      } catch (error) {
        return `${(value * 100).toFixed(2)}%`;
      }
    },

    // 日期格式化器
    date: (date, options = {}) => {
      try {
        return new Intl.DateTimeFormat(currentLanguage, options).format(date);
      } catch (error) {
        return date.toLocaleDateString();
      }
    },

    // 时间格式化器
    time: (date, options = {}) => {
      try {
        return new Intl.DateTimeFormat(currentLanguage, {
          timeStyle: 'medium',
          ...options
        }).format(date);
      } catch (error) {
        return date.toLocaleTimeString();
      }
    },

    // 相对时间格式化器
    relativeTime: (date) => {
      try {
        const rtf = new Intl.RelativeTimeFormat(currentLanguage, { numeric: 'auto' });
        const now = new Date();
        const diffInSeconds = Math.floor((date - now) / 1000);
        
        if (Math.abs(diffInSeconds) < 60) {
          return rtf.format(diffInSeconds, 'second');
        } else if (Math.abs(diffInSeconds) < 3600) {
          return rtf.format(Math.floor(diffInSeconds / 60), 'minute');
        } else if (Math.abs(diffInSeconds) < 86400) {
          return rtf.format(Math.floor(diffInSeconds / 3600), 'hour');
        } else {
          return rtf.format(Math.floor(diffInSeconds / 86400), 'day');
        }
      } catch (error) {
        return date.toLocaleDateString();
      }
    }
  };

  return formatters;
};

// 辅助函数：根据地理位置推断语言
function inferLanguageFromLocation(latitude, longitude) {
  // 简化的地理位置到语言映射
  const locationLanguageMap = [
    { bounds: { north: 54, south: 18, east: 135, west: 73 }, language: 'zh-CN' }, // 中国
    { bounds: { north: 46, south: 30, east: 146, west: 129 }, language: 'ja-JP' }, // 日本
    { bounds: { north: 39, south: 33, east: 132, west: 124 }, language: 'ko-KR' }, // 韩国
    { bounds: { north: 49, south: 25, east: -66, west: -125 }, language: 'en-US' }, // 美国
    { bounds: { north: 44, south: 36, east: 10, west: -5 }, language: 'es-ES' }, // 西班牙
    { bounds: { north: 51, south: 42, east: 8, west: -5 }, language: 'fr-FR' }, // 法国
    { bounds: { north: 55, south: 47, east: 15, west: 6 }, language: 'de-DE' }, // 德国
  ];

  for (const region of locationLanguageMap) {
    if (latitude >= region.bounds.south && latitude <= region.bounds.north &&
        longitude >= region.bounds.west && longitude <= region.bounds.east) {
      return region.language;
    }
  }

  return null;
}

// 辅助函数：根据时区推断语言
function inferLanguageFromTimezone(timezone) {
  const timezoneLanguageMap = {
    'Asia/Shanghai': 'zh-CN',
    'Asia/Beijing': 'zh-CN',
    'Asia/Hong_Kong': 'zh-CN',
    'Asia/Tokyo': 'ja-JP',
    'Asia/Seoul': 'ko-KR',
    'America/New_York': 'en-US',
    'America/Los_Angeles': 'en-US',
    'America/Chicago': 'en-US',
    'Europe/Madrid': 'es-ES',
    'Europe/Paris': 'fr-FR',
    'Europe/Berlin': 'de-DE',
    'Europe/London': 'en-US'
  };

  return timezoneLanguageMap[timezone] || null;
}

export default useTranslation;

