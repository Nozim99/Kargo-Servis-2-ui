import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import uz from './locales/uz/translation.json';
import ru from './locales/ru/translation.json';

const localStorageKey = 'lang';

i18n
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            uz: {
                translation: uz
            },
            ru: {
                translation: ru
            }
        },
        lng: localStorage.getItem(localStorageKey) || 'uz', // boshlang'ich til
        fallbackLng: 'uz', // agar tarjima topilmasa, ishlatiladigan til
        interpolation: {
            escapeValue: false // react already safes from xss
        },
        detection: {
            order: ['localStorage'],
            lookupLocalStorage: localStorageKey,
            caches: ['localStorage']
        }
    });

i18n.on('languageChanged', (lng) => {
    localStorage.setItem(localStorageKey, lng);
});

export default i18n;