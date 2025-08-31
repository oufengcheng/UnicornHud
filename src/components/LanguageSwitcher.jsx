import React, { useState, useEffect, useRef } from 'react';
import i18n, { SUPPORTED_LANGUAGES, t } from '../i18n';

const LanguageSwitcher = ({ className = '', showLabel = true, compact = false }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.getCurrentLanguage());
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // 监听语言变化
    const unsubscribe = i18n.addListener((newLanguage) => {
      setCurrentLanguage(newLanguage);
    });

    // 点击外部关闭下拉菜单
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  const currentLanguageInfo = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage);

  if (compact) {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          title={t('common.changeLanguage')}
        >
          <span className="text-xs font-medium">
            {currentLanguageInfo?.displayCode || currentLanguageInfo?.code.split('-')[0].toUpperCase()}
          </span>
          <svg 
            className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
            <div className="py-1">
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                    language.code === currentLanguage ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                  {language.code === currentLanguage && (
                    <svg className="w-4 h-4 ml-auto text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <span className="text-xl">{currentLanguageInfo?.flag}</span>
        {showLabel && (
          <span className="font-medium">{currentLanguageInfo?.name}</span>
        )}
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
              {t('common.selectLanguage')}
            </div>
            {SUPPORTED_LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-3 transition-colors ${
                  language.code === currentLanguage ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                }`}
              >
                <span className="text-xl">{language.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{language.name}</div>
                  <div className="text-xs text-gray-500">
                    {language.displayCode || language.code.split('-')[0].toUpperCase()}
                  </div>
                </div>
                {language.code === currentLanguage && (
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 简单的语言切换按钮组件
export const LanguageToggle = ({ className = '' }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.getCurrentLanguage());

  useEffect(() => {
    const unsubscribe = i18n.addListener(setCurrentLanguage);
    return unsubscribe;
  }, []);

  const toggleLanguage = () => {
    const currentIndex = SUPPORTED_LANGUAGES.findIndex(lang => lang.code === currentLanguage);
    const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
    const nextLanguage = SUPPORTED_LANGUAGES[nextIndex];
    i18n.changeLanguage(nextLanguage.code);
  };

  const currentLanguageInfo = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage);

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center space-x-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors ${className}`}
      title={`${t('common.currentLanguage')}: ${currentLanguageInfo?.name}`}
    >
      <span className="text-lg">{currentLanguageInfo?.flag}</span>
      <span className="text-xs font-medium">
        {currentLanguageInfo?.displayCode || currentLanguageInfo?.code.split('-')[0].toUpperCase()}
      </span>
    </button>
  );
};

// 语言状态指示器
export const LanguageIndicator = ({ className = '' }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.getCurrentLanguage());

  useEffect(() => {
    const unsubscribe = i18n.addListener(setCurrentLanguage);
    return unsubscribe;
  }, []);

  const currentLanguageInfo = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage);

  return (
    <div className={`flex items-center space-x-1 text-xs text-gray-500 ${className}`}>
      <span>{currentLanguageInfo?.flag}</span>
      <span>{currentLanguageInfo?.name}</span>
    </div>
  );
};

export default LanguageSwitcher;

