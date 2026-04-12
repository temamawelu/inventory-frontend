import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button
        onClick={() => changeLanguage('en')}
        style={{
          background: i18n.language === 'en' ? '#3b82f6' : '#4b5563',
          color: 'white',
          border: 'none',
          padding: '4px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '500',
          transition: 'all 0.2s'
        }}
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => changeLanguage('de')}
        style={{
          background: i18n.language === 'de' ? '#3b82f6' : '#4b5563',
          color: 'white',
          border: 'none',
          padding: '4px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '500',
          transition: 'all 0.2s'
        }}
      >
        🇩🇪 DE
      </button>
    </div>
  );
};

export default LanguageSwitcher;
