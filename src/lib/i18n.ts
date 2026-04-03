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
    product_show_price: "顯示價格",

    // Breadcrumb
    breadcrumb_home: "首頁",
    breadcrumb_categories: "產品分類",

    // Navbar
    nav_about: "關於我們",
    nav_contact: "聯絡我們",

    // About page
    about_title: "關於我們",
    about_desc: "我們致力於挑選高品質、高CP值的3C產品，讓每個人都能輕鬆享受科技帶來的便利生活。從日常實用的小物，到提升生活效率的設備，每一樣商品都經過嚴選，希望帶給您安心與實用兼具的購物體驗。",
    about_philosophy_title: "選品理念",
    about_philosophy_1: "嚴選實用、高評價商品",
    about_philosophy_2: "優先推薦穩定品質品牌",
    about_philosophy_3: "不販售來源不明或低品質產品",
    about_philosophy_4: "持續更新市場熱門與實測推薦商品",
    about_philosophy_desc: "我們相信，好的商品不需要過度包裝，只需要真正好用。",

    // Contact page
    contact_title: "聯絡我們",
    contact_desc: "我們重視每一位顧客的回饋，歡迎隨時與我們聯繫。",
    contact_email_label: "電子信箱",
    contact_email: "dlightsales@d-light.com.tw",
    contact_info_title: "聯絡資訊",
    contact_company: "威翰國際行銷有限公司",
    contact_tax_id_label: "統一編號",
    contact_tax_id: "28312320",
    contact_address_label: "地址",
    contact_address: "新北市汐止區福德一路111之6號13樓",
    contact_phone_label: "電話",
    contact_phone: "0921175823",

    // Footer
    footer_desc: "我們致力於挑選高品質、高CP值的3C產品，讓每個人都能輕鬆享受科技帶來的便利生活。",
    footer_quick_links: "快速連結",
    footer_home: "首頁",
    footer_all_products: "所有商品",
    footer_categories: "產品分類",
    footer_about: "關於我們",
    footer_support: "客戶服務",
    footer_faq: "常見問題",
    footer_return_policy: "退換貨政策",
    footer_contact_us: "聯絡我們",
    footer_contact_info: "聯絡資訊",
    footer_company: "威翰國際行銷有限公司",
    footer_address: "新北市汐止區福德一路111之6號13樓",
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
    product_show_price: "Show Price",

    // Breadcrumb
    breadcrumb_home: "Home",
    breadcrumb_categories: "Categories",

    // Navbar
    nav_about: "About",
    nav_contact: "Contact",

    // About page
    about_title: "About Us",
    about_desc: "We are dedicated to selecting high-quality, high-value 3C products, making it easy for everyone to enjoy the convenience that technology brings. From everyday essentials to devices that enhance your productivity, every product is carefully curated to provide you with a reassuring and practical shopping experience.",
    about_philosophy_title: "Our Selection Philosophy",
    about_philosophy_1: "Carefully selected practical, highly-rated products",
    about_philosophy_2: "Priority on recommending brands with consistent quality",
    about_philosophy_3: "No products from unknown sources or of low quality",
    about_philosophy_4: "Continuously updated with trending and tested recommendations",
    about_philosophy_desc: "We believe great products don't need excessive packaging — they just need to truly work well.",

    // Contact page
    contact_title: "Contact Us",
    contact_desc: "We value every customer's feedback. Feel free to reach out to us anytime.",
    contact_email_label: "Email",
    contact_email: "dlightsales@d-light.com.tw",
    contact_info_title: "Contact Information",
    contact_company: "Weihan International Marketing Co., Ltd.",
    contact_tax_id_label: "Tax ID",
    contact_tax_id: "28312320",
    contact_address_label: "Address",
    contact_address: "13F, No. 111-6, Fude 1st Rd., Xizhi Dist., New Taipei City",
    contact_phone_label: "Phone",
    contact_phone: "0921175823",

    // Footer
    footer_desc: "We are dedicated to selecting high-quality, high-value 3C products, making it easy for everyone to enjoy the convenience of technology.",
    footer_quick_links: "Quick Links",
    footer_home: "Home",
    footer_all_products: "All Products",
    footer_categories: "Categories",
    footer_about: "About Us",
    footer_support: "Customer Service",
    footer_faq: "FAQ",
    footer_return_policy: "Return Policy",
    footer_contact_us: "Contact Us",
    footer_contact_info: "Contact Info",
    footer_company: "Weihan International Marketing Co., Ltd.",
    footer_address: "13F, No. 111-6, Fude 1st Rd., Xizhi Dist., New Taipei City",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Service",
  },
} as const;

export type TranslationKey = keyof typeof translations.zh;

export function getTranslation(locale: Locale, key: TranslationKey) {
  return translations[locale][key];
}
