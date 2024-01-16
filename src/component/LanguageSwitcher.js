import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <>
      <button onClick={() => i18n.changeLanguage('en')}>EN</button>
      <button onClick={() => i18n.changeLanguage('pl')}>PL</button>
    </>
  );
}

export default LanguageSwitcher;