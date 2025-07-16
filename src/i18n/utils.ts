import { defaultLang, ui } from '@/i18n/ui';

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
    return function t(key: keyof typeof ui[typeof defaultLang], ...interpolations: string[]) {
        const translation = ui[lang][key] ?? ui[defaultLang][key];
        return translation.replace(/\{\{(\d+)\}\}/g, (_, i) => interpolations[i]);
    }
}