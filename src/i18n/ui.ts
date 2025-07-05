export const languages = {
    "zh-tw": '繁體中文',
    "en": 'English',
};

export const defaultLang = 'zh-tw' as const;

export const ui = {
    "zh-tw": {
        'nav.home': '首頁',
        'nav.about': '關於',
        'nav.works': '作品',
        'nav.github': 'GitHub',
        'nav.blog': '部落格',
        'nav.search.placeholder': '輸入關鍵字搜尋...',
        'sidebar.view_more': '查看更多',
        'sidebar.tags': '標籤',
        'sidebar.categories': '分類',
        'copyright.author': '作者',
        'copyright.publish_date': '發佈日期',
        'copyright.license': '授權',
        'archive.year_title_count': '共 {{0}} 篇文章',
        'post.card.words': '字',
        'post.card.minutes': '分鐘',
        'pages.archive.archive': '封存',
        'pages.categories.archive': '封存分類',
        'pages.categories.title': '分類',
        'pages.tags.archive': '封存標籤',
        'pages.tags.title': '標籤',
    },
    "en": {
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.works': 'Works',
        'nav.github': 'GitHub',
        'nav.blog': 'Blog',
        'nav.search.placeholder': 'Search...',
        'sidebar.view_more': 'View More',
        'sidebar.tags': 'Tags',
        'sidebar.categories': 'Categories',
        'copyright.author': 'Author',
        'copyright.publish_date': 'Publish Date',
        'copyright.license': 'License',
        'archive.year_title_count': 'Total {{0}} articles'
    },
} as const;