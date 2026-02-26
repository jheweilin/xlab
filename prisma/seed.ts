import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 開始建立種子資料...");

  // Create admin user
  const hashedPassword = await hash(
    process.env.ADMIN_PASSWORD || "admin123",
    12
  );

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@xlab.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@xlab.com",
      password: hashedPassword,
      name: "Admin",
      role: "SUPER_ADMIN",
    },
  });

  console.log(`✅ 管理員帳號已建立: ${admin.email}`);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "gaming-peripherals" },
      update: {},
      create: {
        name: "電競周邊",
        slug: "gaming-peripherals",
        description: "專業電競周邊設備，提升您的遊戲體驗",
        order: 1,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "cooling-solutions" },
      update: {},
      create: {
        name: "散熱解決方案",
        slug: "cooling-solutions",
        description: "高效能散熱產品，維持系統穩定運作",
        order: 2,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "pc-cases" },
      update: {},
      create: {
        name: "電腦機殼",
        slug: "pc-cases",
        description: "多款風格機殼，打造專屬電腦",
        order: 3,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "power-supplies" },
      update: {},
      create: {
        name: "電源供應器",
        slug: "power-supplies",
        description: "穩定高效電源，為系統提供可靠動力",
        order: 4,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ 已建立 ${categories.length} 個主分類`);

  // Create subcategories
  const gamingCategory = categories[0];
  const coolingCategory = categories[1];

  const subCategories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "gaming-keyboards" },
      update: {},
      create: {
        name: "電競鍵盤",
        slug: "gaming-keyboards",
        description: "機械式電競鍵盤，快速精準反應",
        parentId: gamingCategory.id,
        order: 1,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "gaming-mice" },
      update: {},
      create: {
        name: "電競滑鼠",
        slug: "gaming-mice",
        description: "高精度電競滑鼠，精準掌控",
        parentId: gamingCategory.id,
        order: 2,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "gaming-headsets" },
      update: {},
      create: {
        name: "電競耳機",
        slug: "gaming-headsets",
        description: "沉浸式音效體驗",
        parentId: gamingCategory.id,
        order: 3,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "cpu-coolers" },
      update: {},
      create: {
        name: "CPU 散熱器",
        slug: "cpu-coolers",
        description: "塔型與水冷散熱解決方案",
        parentId: coolingCategory.id,
        order: 1,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "case-fans" },
      update: {},
      create: {
        name: "機殼風扇",
        slug: "case-fans",
        description: "高效靜音風扇",
        parentId: coolingCategory.id,
        order: 2,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ 已建立 ${subCategories.length} 個子分類`);

  // Create sample products
  const products = await Promise.all([
    // Gaming Keyboards
    prisma.product.upsert({
      where: { slug: "mk850-gaming-keyboard" },
      update: {},
      create: {
        name: "MK850 電競機械鍵盤",
        slug: "mk850-gaming-keyboard",
        description:
          "採用 Cherry MX 機械軸，支援 RGB 燈效，磁吸式手托設計",
        content: `
• 軸體：Cherry MX 紅軸/青軸/茶軸可選
• 背光：1680 萬色 RGB 燈效
• 連接：USB Type-C 可拆卸線材
• 特色：磁吸式手托、多媒體旋鈕
• 尺寸：440 x 140 x 40 mm
• 重量：1.2 kg
        `,
        price: 4990,
        categoryId: subCategories[0].id,
        tags: "新品,熱銷",
        isFeatured: true,
        isActive: true,
        order: 1,
      },
    }),
    prisma.product.upsert({
      where: { slug: "ck550-v2-keyboard" },
      update: {},
      create: {
        name: "CK550 V2 機械鍵盤",
        slug: "ck550-v2-keyboard",
        description: "入門級電競機械鍵盤，RGB 燈效，全鍵無衝突",
        content: `
• 軸體：Gateron 機械軸
• 背光：RGB 燈效
• 連接：USB Type-C
• 特色：全鍵無衝突、巨集錄製
• 尺寸：437 x 130 x 38 mm
        `,
        price: 2490,
        categoryId: subCategories[0].id,
        tags: "入門推薦",
        isFeatured: false,
        isActive: true,
        order: 2,
      },
    }),
    // Gaming Mice
    prisma.product.upsert({
      where: { slug: "mm730-gaming-mouse" },
      update: {},
      create: {
        name: "MM730 超輕量電競滑鼠",
        slug: "mm730-gaming-mouse",
        description: "僅重 48g 的超輕量設計，16000 DPI 光學感應器",
        content: `
• 感應器：PixArt PAW3389
• DPI：最高 16000
• 重量：48g（無線材）
• 按鍵壽命：7000 萬次
• 連接：USB Type-C 編織線
• RGB：支援
        `,
        price: 1990,
        categoryId: subCategories[1].id,
        tags: "輕量化,熱銷",
        isFeatured: true,
        isActive: true,
        order: 1,
      },
    }),
    prisma.product.upsert({
      where: { slug: "mm712-wireless-mouse" },
      update: {},
      create: {
        name: "MM712 無線電競滑鼠",
        slug: "mm712-wireless-mouse",
        description: "三模連接，超長續航，人體工學設計",
        content: `
• 感應器：PixArt PAW3370
• DPI：最高 19000
• 連接：2.4GHz / 藍牙 / 有線
• 續航：最長 80 小時
• 重量：59g
        `,
        price: 2490,
        categoryId: subCategories[1].id,
        tags: "無線",
        isFeatured: false,
        isActive: true,
        order: 2,
      },
    }),
    // Gaming Headsets
    prisma.product.upsert({
      where: { slug: "mh752-headset" },
      update: {},
      create: {
        name: "MH752 電競耳機",
        slug: "mh752-headset",
        description: "虛擬 7.1 聲道，可拆卸麥克風，舒適記憶海綿耳罩",
        content: `
• 驅動單體：40mm 釹磁鐵
• 頻率響應：15Hz - 25kHz
• 阻抗：26Ω
• 麥克風：可拆卸全向式
• 連接：USB / 3.5mm
        `,
        price: 2990,
        categoryId: subCategories[2].id,
        tags: "7.1 聲道",
        isFeatured: true,
        isActive: true,
        order: 1,
      },
    }),
    // CPU Coolers
    prisma.product.upsert({
      where: { slug: "hyper-212-evo-v2" },
      update: {},
      create: {
        name: "Hyper 212 EVO V2 散熱器",
        slug: "hyper-212-evo-v2",
        description: "經典塔型散熱器升級版，4 根熱導管，靜音設計",
        content: `
• 類型：塔型散熱器
• 熱導管：4 根 6mm
• 風扇：120mm SickleFlow
• TDP 支援：最高 150W
• 相容性：Intel LGA 1700/1200/115x, AMD AM5/AM4
        `,
        price: 1290,
        categoryId: subCategories[3].id,
        tags: "經典款,CP 值高",
        isFeatured: false,
        isActive: true,
        order: 1,
      },
    }),
    prisma.product.upsert({
      where: { slug: "masterliquid-360-atmos" },
      update: {},
      create: {
        name: "MasterLiquid 360 Atmos 水冷",
        slug: "masterliquid-360-atmos",
        description: "360mm 一體式水冷，雙腔幫浦設計，極致散熱效能",
        content: `
• 冷排尺寸：360mm
• 幫浦：雙腔設計
• 風扇：3x 120mm ARGB
• 軟管：低蒸發橡膠管
• 相容性：Intel LGA 1700/1200, AMD AM5/AM4
        `,
        price: 5990,
        categoryId: subCategories[3].id,
        tags: "高階,水冷",
        isFeatured: true,
        isActive: true,
        order: 2,
      },
    }),
    // Case Fans
    prisma.product.upsert({
      where: { slug: "sickleflow-120-argb-3pack" },
      update: {},
      create: {
        name: "SickleFlow 120 ARGB 三入組",
        slug: "sickleflow-120-argb-3pack",
        description: "高風量靜音風扇，ARGB 燈效，含控制器",
        content: `
• 尺寸：120mm
• 轉速：650-1800 RPM
• 風量：62 CFM
• 噪音：8-27 dBA
• 燈效：ARGB
• 含 ARGB 控制器
        `,
        price: 1690,
        categoryId: subCategories[4].id,
        tags: "ARGB,超值組",
        isFeatured: false,
        isActive: true,
        order: 1,
      },
    }),
    // PC Cases
    prisma.product.upsert({
      where: { slug: "masterbox-td500-mesh" },
      update: {},
      create: {
        name: "MasterBox TD500 Mesh 機殼",
        slug: "masterbox-td500-mesh",
        description: "菱形網孔前面板，出色散熱，鋼化玻璃側板",
        content: `
• 尺寸：ATX 中塔
• 主機板支援：E-ATX / ATX / M-ATX / Mini-ITX
• 顯卡長度：最長 410mm
• CPU 散熱器高度：最高 165mm
• 預裝風扇：3x 120mm ARGB
• I/O：USB 3.2 x2, USB-C x1
        `,
        price: 3290,
        categoryId: categories[2].id,
        tags: "散熱佳,高 CP",
        isFeatured: true,
        isActive: true,
        order: 1,
      },
    }),
    // Power Supplies
    prisma.product.upsert({
      where: { slug: "v850-gold-v2" },
      update: {},
      create: {
        name: "V850 Gold V2 電源供應器",
        slug: "v850-gold-v2",
        description: "850W 80+ 金牌認證，全模組化，靜音風扇",
        content: `
• 瓦數：850W
• 認證：80 Plus Gold
• 模組化：全模組
• 風扇：135mm FDB 軸承
• 保護：OVP / OPP / SCP / OTP / UVP
• 保固：10 年
        `,
        price: 4490,
        categoryId: categories[3].id,
        tags: "金牌,全模組",
        isFeatured: false,
        isActive: true,
        order: 1,
      },
    }),
  ]);

  console.log(`✅ 已建立 ${products.length} 個商品`);

  console.log("\n🎉 種子資料建立完成！");
  console.log(`\n管理後台登入資訊：`);
  console.log(`  Email: ${admin.email}`);
  console.log(`  Password: ${process.env.ADMIN_PASSWORD || "admin123"}`);
}

main()
  .catch((e) => {
    console.error("❌ 種子資料建立失敗:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
