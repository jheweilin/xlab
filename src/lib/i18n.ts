export type Locale = "zh" | "en";

export const translations = {
  zh: {
    // Navbar
    nav_home: "首頁",
    nav_all_products: "所有商品",

    // Hero Banner
    hero_badge: "最新科技產品",
    hero_title_1: "探索",
    hero_title_2: "科技新境界",
    hero_desc: "精選最頂尖的 3C 電子產品，從電腦零組件到周邊配件，打造屬於你的科技生活。品質保證，專業服務。",
    hero_browse: "瀏覽商品",
    hero_categories: "查看分類",
    hero_stat_products: "精選商品",
    hero_stat_brands: "知名品牌",
    hero_stat_shipping: "快速出貨",

    // Home page
    home_categories_title: "產品分類",
    home_categories_desc: "探索我們的產品系列",
    home_featured_title: "精選商品",
    home_featured_desc: "我們推薦的優質產品",
    home_latest_title: "最新商品",
    home_latest_desc: "剛上架的新品",
    home_view_all: "查看全部",
    home_cta_title: "準備好開始了嗎？",
    home_cta_desc: "探索我們完整的產品目錄，找到適合您的 3C 產品",
    home_cta_button: "立即瀏覽",

    // Category
    category_browse: "瀏覽商品",
    categories_title: "產品分類",
    categories_desc: "瀏覽所有產品分類",
    categories_empty: "目前沒有分類",
    category_all: "全部",
    category_empty: "此分類目前沒有商品",
    category_total: (n: number) => `共 ${n} 件商品`,

    // Products
    products_title: "所有商品",
    products_featured_title: "精選商品",
    products_total: (n: number) => `共 ${n} 件商品`,
    products_empty: "目前沒有商品",
    product_featured_badge: "精選",
    product_contact: "聯絡購買",
    product_inquiry: "加入詢價",
    product_specs: "產品規格",
    product_detail_specs: "詳細規格",
    product_related: "相關商品",
    product_back: "返回商品列表",

    // Breadcrumb
    breadcrumb_home: "首頁",
    breadcrumb_categories: "產品分類",

    // Footer
    footer_desc: "探索最新 3C 電子產品，體驗科技生活。提供最優質的產品與服務。",
    footer_quick_links: "快速連結",
    footer_home: "首頁",
    footer_all_products: "所有商品",
    footer_categories: "產品分類",
    footer_support: "客戶服務",
    footer_faq: "常見問題",
    footer_return_policy: "退換貨政策",
    footer_contact_us: "聯絡我們",
    footer_contact_info: "聯絡資訊",
    footer_address: "台北市信義區信義路五段 7 號",
    footer_privacy: "隱私權政策",
    footer_terms: "使用條款",
  },
  en: {
    // Navbar
    nav_home: "Home",
    nav_all_products: "All Products",

    // Hero Banner
    hero_badge: "Latest Tech Products",
    hero_title_1: "Explore",
    hero_title_2: "New Tech Frontiers",
    hero_desc: "Curated premium 3C electronics, from computer components to peripherals. Build your tech lifestyle with quality assurance and professional service.",
    hero_browse: "Browse Products",
    hero_categories: "View Categories",
    hero_stat_products: "Curated Products",
    hero_stat_brands: "Top Brands",
    hero_stat_shipping: "Fast Shipping",

    // Home page
    home_categories_title: "Categories",
    home_categories_desc: "Explore our product lines",
    home_featured_title: "Featured Products",
    home_featured_desc: "Our recommended quality products",
    home_latest_title: "New Arrivals",
    home_latest_desc: "Freshly listed products",
    home_view_all: "View All",
    home_cta_title: "Ready to Get Started?",
    home_cta_desc: "Explore our complete product catalog and find the perfect 3C products for you",
    home_cta_button: "Browse Now",

    // Category
    category_browse: "Browse",
    categories_title: "Categories",
    categories_desc: "Browse all product categories",
    categories_empty: "No categories available",
    category_all: "All",
    category_empty: "No products in this category",
    category_total: (n: number) => `${n} product${n !== 1 ? "s" : ""}`,

    // Products
    products_title: "All Products",
    products_featured_title: "Featured Products",
    products_total: (n: number) => `${n} product${n !== 1 ? "s" : ""}`,
    products_empty: "No products available",
    product_featured_badge: "Featured",
    product_contact: "Contact to Buy",
    product_inquiry: "Add to Inquiry",
    product_specs: "Specifications",
    product_detail_specs: "Detailed Specs",
    product_related: "Related Products",
    product_back: "Back to Products",

    // Breadcrumb
    breadcrumb_home: "Home",
    breadcrumb_categories: "Categories",

    // Footer
    footer_desc: "Explore the latest 3C electronics and experience the tech lifestyle. Providing the best products and services.",
    footer_quick_links: "Quick Links",
    footer_home: "Home",
    footer_all_products: "All Products",
    footer_categories: "Categories",
    footer_support: "Customer Service",
    footer_faq: "FAQ",
    footer_return_policy: "Return Policy",
    footer_contact_us: "Contact Us",
    footer_contact_info: "Contact Info",
    footer_address: "No. 7, Sec. 5, Xinyi Rd., Xinyi Dist., Taipei",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Service",
  },
} as const;

export type TranslationKey = keyof typeof translations.zh;

export function getTranslation(locale: Locale, key: TranslationKey) {
  return translations[locale][key];
}
