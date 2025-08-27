import { useLanguage } from '../context/LanguageContext';

export const withTranslations = (WrappedComponent) => {
  return (props) => {
    const { language } = useLanguage();
    const translations = require(`../locales/${language}.json`);
    
    return <WrappedComponent {...props} t={(key) => translations[key] || key} />;
  };
};