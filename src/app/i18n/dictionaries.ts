export type Dictionary = {
  nav: {
    home: string;
    about: string;
    services: string;
    contact: string;
  };
  footer: {
    site: string;
    tools: string;
    about: string;
    contact: string;
    list: string;
    textCounter: string;
    passwordGen: string;
  };
  services: {
    title: string;
    subtitle: string;
    card: {
      free: string;
      noInstall: string;
    };
  };
};

export const ja: Dictionary = {
  nav: {
    home: 'ホーム',
    about: '私について',
    services: 'Webツール',
    contact: 'お問い合わせ',
  },
  footer: {
    site: 'サイト',
    tools: 'Webツール',
    about: '私について',
    contact: 'お問い合わせ',
    list: 'Webツール一覧',
    textCounter: '文字数カウンター',
    passwordGen: 'パスワードジェネレーター',
  },
  services: {
    title: 'Webツール一覧',
    subtitle: '軽量・シンプル・実用的。随時追加予定です。',
    card: {
      free: '無料',
      noInstall: 'インストール不要',
    },
  },
};

export const en: Dictionary = {
  nav: {
    home: 'Home',
    about: 'About',
    services: 'Tools',
    contact: 'Contact',
  },
  footer: {
    site: 'Site',
    tools: 'Tools',
    about: 'About',
    contact: 'Contact',
    list: 'All Tools',
    textCounter: 'Text Counter',
    passwordGen: 'Password Generator',
  },
  services: {
    title: 'Web Tools',
    subtitle: 'Lightweight, simple, and practical. More to come.',
    card: {
      free: 'Free',
      noInstall: 'No install required',
    },
  },
};

export function getDictionary(locale: string): Dictionary {
  return locale === 'en' ? en : ja;
}



