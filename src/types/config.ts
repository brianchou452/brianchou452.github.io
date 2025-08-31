import { defaultLang, ui } from '@/i18n/ui';

interface Configuration {
  title: string;
  subTitle: string;
  brandTitle: string;

  description: string;

  site: string;

  locale: "en" | "zh-tw";

  navigators: { nameKey: keyof typeof ui[typeof defaultLang]; href: string }[];

  username: string;
  sign: string;

  socialLinks: { icon: string; link: string; ariaLabel: string }[];

  maxSidebarCategoryChip: number;
  maxSidebarTagChip: number;
  maxFooterCategoryChip: number;
  maxFooterTagChip: number;

  slugMode: "HASH" | "RAW";

  license: {
    name: string;
    url: string;
  };

}

export type { Configuration };
