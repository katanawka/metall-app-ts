
import React, { createContext, useContext } from 'react';
import translations from '../locales/uk';

type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  t: (key) => key as string,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = (key: TranslationKey): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
};
