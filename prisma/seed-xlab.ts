import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 開始建立 XLAB 產品資料...");

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

  console.log(`✅ 管理員帳號: ${admin.email}`);

  // Delete old data
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  console.log("✅ 已清除舊資料");

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "充電配件",
        slug: "charging-accessories",
        description: "快充線、充電頭等充電相關配件",
        order: 1,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: "保護配件",
        slug: "protection-accessories",
        description: "手錶保護殼、鏡頭貼等保護類配件",
        order: 2,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: "音訊配件",
        slug: "audio-accessories",
        description: "有線耳機等音訊配件",
        order: 3,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ 已建立 ${categories.length} 個分類`);

  const chargingCat = categories[0];
  const protectionCat = categories[1];
  const audioCat = categories[2];

  // Create products
  const products = [];

  // 1. XLAB 充電線
  const chargingCable = await prisma.product.create({
    data: {
      name: "XLAB 充電傳輸編織線",
      slug: "xlab-charging-cable",
      description: "PD快充X編織抗拉，承受15,000次彎折仍穩定充電！支援 Type C / USB A / Lightning 多種接頭。",
      content: `【本產品已投保產品責任險，南山產物保險22A0054695】

商品特點：
• PD快充高效穩定：支援快充協議，搭配相容充電器可達高功率輸出
• 480Mbps資料同步：充電/傳輸兩用，照片影片快速傳
• 耐彎15,000+ 次：強化接頭＋加粗護頸，久用不鬆不裂
• 高密度尼龍編織：耐磨抗拉、不易打結，手感紮實
• 穩壓晶片保護：智慧控溫/穩流，守護電池與裝置

規格：
• 傳輸速率：最高 480Mbps（USB 2.0）
• 耐用度：彎折測試 ≥ 15,000 次
• 外被：高密度尼龍編織
• 導體：高純度銅導體
• 顏色：經典黑

接頭類型與瓦數：
• USB-A to Type-C：最高18W
• USB-A to Lightning：最高12W
• Type-C to Lightning：最高20W
• Type-C to Type-C：最高45W/65W/100W

※功率與快充效果依裝置與充電器相容性而定`,
      price: 299,
      categoryId: chargingCat.id,
      tags: "快充,編織線,耐用",
      isFeatured: true,
      isActive: true,
      order: 1,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: chargingCable.id, url: "/uploads/XLAB充電線001.jpg", order: 0 },
      { productId: chargingCable.id, url: "/uploads/XLAB充電線002.jpg", order: 1 },
      { productId: chargingCable.id, url: "/uploads/XLAB充電線003.jpg", order: 2 },
      { productId: chargingCable.id, url: "/uploads/XLAB充電線004.jpg", order: 3 },
      { productId: chargingCable.id, url: "/uploads/XLAB充電線005.jpg", order: 4 },
    ],
  });
  products.push(chargingCable);

  // 2. XLAB 20W 充電頭
  const charger20W = await prisma.product.create({
    data: {
      name: "XLAB 20W GaN氮化鎵快充頭",
      slug: "xlab-charger-20w",
      description: "雙孔快充設計，USB-A + Type-C 雙孔輸出，GaN氮化鎵技術更小巧高效！",
      content: `【本產品已投保產品責任險，南山產物保險22A0054695】

商品特點：
• 雙孔快充設計：USB-A + Type-C 雙孔，可充兩台裝置
• GaN 氮化鎵技術：導熱佳、轉換率高，比傳統充電頭更小巧
• 總功率最高 20W：單孔最高支援 PD快充20W
• 多重安全保護：過電流、過電壓、過熱、過載、短路、過充防護
• 國際電壓支援：AC 110–240V
• 輕巧便攜：僅約 55g

規格：
• 型號：PDM20W-SCA-MF12M
• 尺寸：52 × 27 × 45mm
• 重量：約 55g
• 輸出介面：Type-C x1、USB-A x1
• Type-C 輸出：5V⎓3A、9V⎓2.22A、12V⎓1.67A
• USB-A 輸出：5V⎓3A、9V⎓2A、12V⎓1.5A
• 支援協議：PD3.0 / QC3.0 / Apple 18W・20W
• 認證：BSMI R3H180`,
      price: 399,
      categoryId: chargingCat.id,
      tags: "快充頭,GaN,20W",
      isFeatured: true,
      isActive: true,
      order: 2,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: charger20W.id, url: "/uploads/XLAB充電頭01.jpg", order: 0 },
      { productId: charger20W.id, url: "/uploads/XLAB充電頭02.jpg", order: 1 },
      { productId: charger20W.id, url: "/uploads/XLAB充電頭03.jpg", order: 2 },
      { productId: charger20W.id, url: "/uploads/XLAB充電頭04.jpg", order: 3 },
    ],
  });
  products.push(charger20W);

  // 3. XLAB 35W 充電頭
  const charger35W = await prisma.product.create({
    data: {
      name: "XLAB 35W GaN氮化鎵快充頭",
      slug: "xlab-charger-35w",
      description: "支援 iPhone 17 系列快充！雙孔設計，總功率最高 35W，GaN技術更小巧高效。",
      content: `【本產品已投保產品責任險，南山產物保險22A0054695】

商品特點：
• 雙孔快充設計：USB-A + Type-C 雙孔
• GaN 氮化鎵技術：更小巧、更高效
• 總功率最高 35W：支援 iPhone 17 Pro Max 36W 快充
• 多重安全保護：全方位防護
• 國際電壓支援：AC 110–220V
• 輕巧便攜：僅約 65g

規格：
• 型號：PDM35W-SCA-MF12M
• 尺寸：48 × 26 × 41mm
• 重量：約 65g
• Type-C 輸出：5V⎓3A、9V⎓3A、12V⎓2.92A、15V⎓2.33A、20V⎓1.75A
• USB-A 輸出：5V⎓3A、9V⎓3A、12V⎓2.5A、20V⎓1.5A
• 支援協議：PD3.0 / QC3.0 / Apple 35W
• 認證：BSMI R3H180`,
      price: 599,
      categoryId: chargingCat.id,
      tags: "快充頭,GaN,35W,iPhone17",
      isFeatured: true,
      isActive: true,
      order: 3,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: charger35W.id, url: "/uploads/XLAB充電頭05.jpg", order: 0 },
      { productId: charger35W.id, url: "/uploads/XLAB充電頭06.jpg", order: 1 },
      { productId: charger35W.id, url: "/uploads/XLAB充電頭英文35W.jpg", order: 2 },
    ],
  });
  products.push(charger35W);

  // 4. XLAB 65W 充電頭
  const charger65W = await prisma.product.create({
    data: {
      name: "XLAB 65W GaN氮化鎵快充頭",
      slug: "xlab-charger-65w",
      description: "三孔輸出設計！Type-C x2 + USB-A，總功率最高 65W，筆電手機同時充。",
      content: `【本產品已投保產品責任險，南山產物保險22A0054695】

規格：
• 型號：PDM65W-SCA-MF12M
• 輸出介面：Type-C x2、USB-A x1
• 輸入：AC110-220V，50/60Hz 1.5A Max

單獨輸出：
• Type-C1：5V⎓3A、9V⎓3A、12V⎓3A、15V⎓3A、20V⎓3.25A (65W)
• Type-C2：5V⎓3A、9V⎓2.22A、12V⎓1.67A (20W)
• USB-A：5V⎓3A、9V⎓2A、12V⎓1.5A (18W)

同時輸出：
• Type-C1 + Type-C2：45W + 20W
• Type-C1 + USB-A：45W + 18W
• Type-C2 + USB-A：5V⎓3A (15W)
• 三孔同時：45W + 15W`,
      price: 899,
      categoryId: chargingCat.id,
      tags: "快充頭,GaN,65W,三孔",
      isFeatured: false,
      isActive: true,
      order: 4,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: charger65W.id, url: "/uploads/XLAB充電頭07.jpg", order: 0 },
      { productId: charger65W.id, url: "/uploads/XLAB充電頭08.jpg", order: 1 },
      { productId: charger65W.id, url: "/uploads/XLAB充電頭英文65W.jpg", order: 2 },
    ],
  });
  products.push(charger65W);

  // 5. XLAB 四合一線
  const fourInOne = await prisma.product.create({
    data: {
      name: "XLAB 4合1磁吸65W充電線",
      slug: "xlab-4in1-cable",
      description: "65W PD快充 X 4合1接口，USB-A/Type-C 輸入，可接 Lightning/Type-C，磁吸收納更整潔！",
      content: `【本產品已投保產品責任險，南山產物保險22A0054695】

商品特點：
• 4合1一線多用：USB-A/Type-C 輸入，自由接 Lightning/Type-C
• 65W Max 快充：支援 3A 高電流與 PD 快充
• 磁吸收納：線體自帶磁力，靠近即吸附成圈
• 耐用升級：鋅合金接頭+尼龍編織外被
• 資料同步：USB 2.0 最高 480Mbps

規格：
• 材質：鋅合金接頭、尼龍編織線體
• 線長：1 公尺
• 輸出功率：65W Max
• 傳輸速率：最高 480Mbps

介面功率參考：
• Type-C → Type-C：安卓 66W / iPhone 27W
• Type-C → Lightning：27W Max
• USB-A → Lightning：12W Max
• USB-A → Type-C：66W Max`,
      price: 499,
      categoryId: chargingCat.id,
      tags: "四合一,磁吸,65W",
      isFeatured: true,
      isActive: true,
      order: 5,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: fourInOne.id, url: "/uploads/XLAB四合一線001.jpg", order: 0 },
      { productId: fourInOne.id, url: "/uploads/XLAB四合一線002.jpg", order: 1 },
      { productId: fourInOne.id, url: "/uploads/XLAB四合一線003.jpg", order: 2 },
      { productId: fourInOne.id, url: "/uploads/XLAB四合一線004.jpg", order: 3 },
      { productId: fourInOne.id, url: "/uploads/XLAB四合一線005.jpg", order: 4 },
    ],
  });
  products.push(fourInOne);

  // 6. XLAB 手錶保護殼
  const watchCase = await prisma.product.create({
    data: {
      name: "XLAB Apple Watch 防水一體式錶殼",
      slug: "xlab-apple-watch-case",
      description: "為你的 Apple Watch 穿上「防水盔甲」！結合防水、防摔、防刮三重防護，支援 S4-S11/SE 系列。",
      content: `商品特色：

• 360°全方位防水守護
精密密封結構，實現全方位防水防霧，洗手、跑步、淋雨都不怕進水

• 軍規防摔抗震
一體式包覆設計，緊密貼合錶身，有效抵擋碰撞、刮痕與意外跌落

• 9H鋼化玻璃膜
螢幕防爆抗刮，觸控靈敏無延遲，高效防指紋塗層

• 不影響充電與血氧偵測
精準開孔設計，支援磁吸充電與健康偵測功能

• 親膚柔軟
高品質PC+軟膠材質，輕盈舒適，透氣孔設計

規格：
• 材質：PC
• 適用型號：Apple Watch S11/10/9/8/7/6/5/4/SE
• 尺寸：40mm / 41mm / 44mm / 45mm / 46mm / 49mm
• 組合內容：錶殼 + 背蓋`,
      price: 399,
      categoryId: protectionCat.id,
      tags: "Apple Watch,防水,保護殼",
      isFeatured: true,
      isActive: true,
      order: 1,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: watchCase.id, url: "/uploads/apple watch全覆蓋殼01.jpg", order: 0 },
      { productId: watchCase.id, url: "/uploads/apple watch全覆蓋殼02.jpg", order: 1 },
      { productId: watchCase.id, url: "/uploads/apple watch全覆蓋殼03.jpg", order: 2 },
      { productId: watchCase.id, url: "/uploads/apple watch全覆蓋殼04.jpg", order: 3 },
      { productId: watchCase.id, url: "/uploads/apple watch全覆蓋殼05.jpg", order: 4 },
    ],
  });
  products.push(watchCase);

  // 7. XLAB 鏡頭貼
  const lensProtector = await prisma.product.create({
    data: {
      name: "XLAB 定位秒貼鏡頭保護貼",
      slug: "xlab-lens-protector",
      description: "iPhone 鏡頭也要好好保護！鋁合金+鋼化玻璃，抗刮抗磨力超強，適用 iPhone 14-17 系列。",
      content: `商品特點：

• 硬派守護：特殊製造工藝，堅硬耐用，抗刮抗磨力超強
• 貼合不卡氣泡：靜態吸附技術，有效避免氣泡產生
• 高透不影響拍照：高透明度設計，還原真實畫面
• 多色任你挑：銀色、鈦灰、鈦棕
• 防刮強化：日常使用也不怕刮傷鏡頭
• 精選材質：鋁合金邊框＋鋼化玻璃鏡面

貼心組合：
• 2鏡頭機型 → 2入/組
• 3鏡頭機型 → 3入/組

適用機型：
• iPhone 14/14 Plus/14 Pro/14 Pro Max
• iPhone 15/15 Plus/15 Pro/15 Pro Max
• iPhone 16/16 Plus/16 Pro/16 Pro Max/16e
• iPhone 17/17 Air/17 Pro/17 Pro Max

材質：鋼化玻璃`,
      price: 199,
      categoryId: protectionCat.id,
      tags: "鏡頭貼,iPhone,保護貼",
      isFeatured: false,
      isActive: true,
      order: 2,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: lensProtector.id, url: "/uploads/XLAB鏡頭貼001.jpg", order: 0 },
      { productId: lensProtector.id, url: "/uploads/XLAB鏡頭貼002.jpg", order: 1 },
      { productId: lensProtector.id, url: "/uploads/XLAB鏡頭貼003.jpg", order: 2 },
      { productId: lensProtector.id, url: "/uploads/XLAB鏡頭貼004.jpg", order: 3 },
      { productId: lensProtector.id, url: "/uploads/XLAB鏡頭貼005.jpg", order: 4 },
    ],
  });
  products.push(lensProtector);

  // 8. XLAB 有線耳機
  const wiredEarphone = await prisma.product.create({
    data: {
      name: "XLAB 線控有線耳機",
      slug: "xlab-wired-earphone",
      description: "音樂控必備！三種接頭可選（Type-C/Lightning/3.5mm），高清音質＋清晰通話，入耳式設計舒適貼合。",
      content: `商品特色：

• 三種接頭可選
Type-C / Lightning / 3.5mm 接頭皆有，支援多款手機與設備

• 線控操作更便利
支援三鍵控制：音量調整、切歌、播放暫停

• 10mm 高清單元，重低音震撼
立體聲音效環繞，細節清晰，音場層次分明

• 內建高感度麥克風
通話聲音清晰，抗噪穩定

• 人體工學入耳設計
舒適貼合耳道，長時間配戴不易脫落

規格：
• 接頭類型：Type-C / Lightning / 3.5mm
• 顏色：白色
• 線長：約1.2M
• 材質：TPE

※部分安卓手機若音控功能不支援，屬正常現象
※非原廠原芯耳機，若使用轉接頭轉接，可能不相容`,
      price: 249,
      categoryId: audioCat.id,
      tags: "有線耳機,入耳式,線控",
      isFeatured: false,
      isActive: true,
      order: 1,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: wiredEarphone.id, url: "/uploads/有線耳機01.jpg", order: 0 },
      { productId: wiredEarphone.id, url: "/uploads/有線耳機02.jpg", order: 1 },
      { productId: wiredEarphone.id, url: "/uploads/有線耳機03.jpg", order: 2 },
      { productId: wiredEarphone.id, url: "/uploads/有線耳機04.jpg", order: 3 },
      { productId: wiredEarphone.id, url: "/uploads/有線耳機05.jpg", order: 4 },
    ],
  });
  products.push(wiredEarphone);

  console.log(`✅ 已建立 ${products.length} 個產品`);

  console.log("\n🎉 XLAB 產品資料建立完成！");
  console.log(`\n管理後台：http://localhost:4567/admin`);
  console.log(`帳號：${admin.email}`);
  console.log(`密碼：${process.env.ADMIN_PASSWORD || "admin123"}`);
}

main()
  .catch((e) => {
    console.error("❌ 建立失敗:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
