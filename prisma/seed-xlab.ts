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
    prisma.category.create({
      data: {
        name: "影音配件",
        slug: "av-accessories",
        description: "HDMI線、影音傳輸線等影音配件",
        order: 4,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: "生活周邊",
        slug: "lifestyle-accessories",
        description: "手持風扇、手機支架等生活周邊配件",
        order: 5,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ 已建立 ${categories.length} 個分類`);

  const chargingCat = categories[0];
  const protectionCat = categories[1];
  const audioCat = categories[2];
  const avCat = categories[3];
  const lifestyleCat = categories[4];

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

  // 9. XLAB 超薄磁吸快充行動電源
  const powerBank = await prisma.product.create({
    data: {
      name: "XLAB 超薄磁吸快充行動電源",
      slug: "xlab-magsafe-power-bank",
      description: "磁吸充電+Type-C孔充電，外出攜帶再也不占空間！PD快充最高達20W，極致薄型輕量便攜。",
      content: `商品特色：
1.MagSafe磁吸充電/Type-C雙向充放電
PD快充最高達20W（線充）輸出最高達15W（無線充）。
2.5000mAh 輕巧迷你/10000mAh大容量
續航力更持久，滿足日常使用需求。
3.極致薄型 輕量便攜
鋁合金外殼+弧形設計，輕鬆零負擔。
4.支援多種設備
Type-C孔雙輸出輸入，內附充電線，兼容蘋果/安卓/耳機。
5.多重電路防護
優質電芯過充、短路保護，擁有更長的壽命。
6.精準對位 貼合不擋鏡頭
外型輕薄，簡約時尚。

商品規格：
顏色：原鈦
輸入：Type-C：5V 3A/9V 2A
輸出：Type-C：9V 2.22A/12V 1.67A
無線充輸出：5W/7.5W/10W/15W
多口輸出：無線充：5W+Type-C：5V 2A
材質：鋁合金、塑膠、電子元件

使用說明：
1.對行動電源充電：將充電線Type-C端接上本行動電源輸入孔，另一端接入供電設備，即可為行動電源充電。
2.行動電源對數位產品充電：將欲充電的數位產品充電線Type-C端接上行動電源，或將產品置於無線充電面板上，即可開始充電。`,
      price: 799,
      categoryId: chargingCat.id,
      tags: "行動電源,磁吸,MagSafe,快充",
      isFeatured: true,
      isActive: true,
      order: 6,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: powerBank.id, url: "/uploads/XLAB行動電源01.jpg", order: 0 },
      { productId: powerBank.id, url: "/uploads/XLAB行動電源02.jpg", order: 1 },
      { productId: powerBank.id, url: "/uploads/XLAB行動電源03.jpg", order: 2 },
      { productId: powerBank.id, url: "/uploads/XLAB行動電源04.jpg", order: 3 },
      { productId: powerBank.id, url: "/uploads/XLAB行動電源05.jpg", order: 4 },
    ],
  });
  products.push(powerBank);

  // 10. XLAB 超迷你手持風扇
  const handheldFan = await prisma.product.create({
    data: {
      name: "XLAB 超迷你手持風扇",
      slug: "xlab-mini-handheld-fan",
      description: "炎炎夏日必備！85g超輕量設計，五檔風速調節，高清LED螢幕顯示電量，Type-C快速充電。",
      content: `商品特色：
1.五檔風速調節
支援一檔清風到五檔強勁風力，自由調整風速，室內外都適用。
2.85g極致輕量設計
機身僅 102×39×43mm，重量約 85g，輕鬆放入口袋或包包，攜帶方便。
3.高清LED螢幕
可即時顯示風速檔位與電量，使用更直覺，不怕突然沒電。
4.Type-C快速充電
採用 Type-C充電接口，支援行動電源、手機充電器等設備。
5.無刷電機強勁風力
高效節能馬達，風力強勁同時保持低耗電。
6.手持＋掛繩設計
附掛繩可手持或掛脖使用，逛街、通勤、露營更方便。
7.安全防護設計
防護網設計，避免誤觸扇葉，使用更安心。

商品規格：
產品名稱：迷你手持高速風扇
產品型號：G027 / H02
風速模式：五檔風速調節
電池容量：3000mAh
充電方式：Type-C 充電（DC5V/2A）
產品尺寸：102 × 39 × 43 mm
產品重量：約 85g
顏色選擇：黑色 / 橙色 / 綠色`,
      price: 399,
      categoryId: lifestyleCat.id,
      tags: "手持風扇,迷你,USB風扇",
      isFeatured: true,
      isActive: true,
      order: 1,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: handheldFan.id, url: "/uploads/XLAB手持風扇01.jpg", order: 0 },
      { productId: handheldFan.id, url: "/uploads/XLAB手持風扇02.jpg", order: 1 },
      { productId: handheldFan.id, url: "/uploads/XLAB手持風扇03.jpg", order: 2 },
      { productId: handheldFan.id, url: "/uploads/XLAB手持風扇04.jpg", order: 3 },
      { productId: handheldFan.id, url: "/uploads/XLAB手持風扇05.jpg", order: 4 },
      { productId: handheldFan.id, url: "/uploads/XLAB手持風扇06.jpg", order: 5 },
      { productId: handheldFan.id, url: "/uploads/XLAB手持風扇07.jpg", order: 6 },
      { productId: handheldFan.id, url: "/uploads/XLAB手持風扇08.jpg", order: 7 },
    ],
  });
  products.push(handheldFan);

  // 11. XLAB 真空吸附磁吸手機架
  const phoneMount = await prisma.product.create({
    data: {
      name: "XLAB 真空吸附磁吸手機架",
      slug: "xlab-vacuum-phone-mount",
      description: "環形強磁＋真空增壓，顛簸不掉穩有如黏住，單手取放、萬向旋轉不擋視線，導航追劇更順手。",
      content: `商品特色：
1.環形強磁貼合：磁吸面積大、受力均勻，急煞/顛簸也穩固。
2.單手取放：靠近即吸、拿起即走，行車更安全。
3.萬向旋轉：橫/豎屏自由切換，角度高低皆可微調。
4.觸碰感應增壓：內置電機與晶片，輕觸啟動抽壓，吸力即刻提升。
5.密閉真空排氣：大面積真空吸盤，長效不脫落。
6.防抖緩衝結構：坑洞路面、連續震動也不亂晃。
7.智慧吸附/解鎖：一鍵解鎖更順手。
8.合金機身：耐用不鬆垮，質感升級。
9.大容量電池：續航更久，無需頻繁充電。
10.廣泛相容：支援 4–7.2 吋手機，多機型皆可用。

安裝方式：真空吸盤固定（適用中控台/擋風玻璃等平整位置）
吸附方式：環形強磁 + 真空增壓（內置電機/晶片，觸碰即抽壓）
調整範圍：球頭萬向旋轉，橫/豎屏與仰角自由調整
材質：合金本體+強磁模組+耐候吸盤
相容尺寸：4–7.2 吋手機
供電/續航：內置電池（大容量，實際續航依使用頻率）
內容物：手機架本體（其餘配件如金屬環/Type-C 充電線依賣場選項）

安裝與使用步驟：
1.以酒精擦拭安裝面，保持乾燥平整。
2.將吸盤貼上 → 輕壓排氣 → 扳/按鎖固定。
3.觸碰感應鍵啟動抽壓增附，吸力升級。
4.將手機靠近磁面自動吸附，調整角度即可。

※非磁吸殼或無磁環的手機（多數安卓/一般保護殼）建議貼金屬環/磁吸環以獲得最佳吸力。`,
      price: 699,
      categoryId: lifestyleCat.id,
      tags: "手機架,車用,磁吸,真空吸附",
      isFeatured: true,
      isActive: true,
      order: 2,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: phoneMount.id, url: "/uploads/XLAB手機支架01.jpg", order: 0 },
      { productId: phoneMount.id, url: "/uploads/XLAB手機支架02.jpg", order: 1 },
      { productId: phoneMount.id, url: "/uploads/XLAB手機支架03.jpg", order: 2 },
      { productId: phoneMount.id, url: "/uploads/XLAB手機支架04.jpg", order: 3 },
      { productId: phoneMount.id, url: "/uploads/XLAB手機支架05.jpg", order: 4 },
      { productId: phoneMount.id, url: "/uploads/XLAB手機支架06.jpg", order: 5 },
      { productId: phoneMount.id, url: "/uploads/XLAB手機支架07.jpg", order: 6 },
    ],
  });
  products.push(phoneMount);

  // 12. XLAB HDMI影音傳輸線
  const hdmiCable = await prisma.product.create({
    data: {
      name: "XLAB HDMI影音傳輸線",
      slug: "xlab-hdmi-cable",
      description: "4K/60Hz・18Gbps 高速穩定，HDR 色彩震撼更流暢！HDMI 2.0規格，向下相容1.4/1.2。",
      content: `商品特色：
1.4K 超清流暢：支援 4K/60Hz、HDR 動態顯示，色彩更細膩、畫面更震撼。
2.18Gbps高速穩定：HDMI 2.0規格，視訊不卡頓、遊戲低延遲。
3.聲畫同步：影像與音訊同步輸出，追劇/打機更沉浸。
4.抗干擾升級：高純度 OFC 無氧銅＋5 組鋁箔屏蔽＋編織層，畫質更穩定。
5.耐用再強化：加粗線徑＋厚實 PVC 外皮，抗壓耐彎折，施工穿管也安心。

規格：
介面類型：標準 HDMI A—A（公對公）
線長選擇：1m／1.8m／3m
材質用料：
• 24K 鍍金端子頭：高導電、不易氧化、訊號更穩
• 高純度 OFC 無氧銅導體：減少損耗、畫質不失真
• 標準 19+1 滿芯：完整腳位、穩定傳輸
• 5組獨立鋁箔屏蔽＋外層編織網：強化抗電磁干擾（EMI/RFI）
• 加粗線徑＋加厚 PVC 外皮：耐磨抗壓、抗拉扯
相容性：向下相容 HDMI 1.4/1.2
支援：4K/60Hz、HDR、3D、BT.2020 寬色域、ARC（依設備支援）

適用場景：
• 家庭劇院：電視／音響／機上盒，打造大螢幕沉浸觀影
• 遊戲娛樂：PS5/PS4、XBOX、Switch，低延遲高速傳輸
• 會議投影：筆電接投影機／會議盒，訊號穩定不卡畫
• 商業大屏：廣告看板、LED 顯示屏、展場長時輸出`,
      price: 299,
      categoryId: avCat.id,
      tags: "HDMI,4K,影音線",
      isFeatured: true,
      isActive: true,
      order: 1,
    },
  });

  await prisma.productImage.createMany({
    data: [
      { productId: hdmiCable.id, url: "/uploads/XLABhdmi線01.jpg", order: 0 },
      { productId: hdmiCable.id, url: "/uploads/XLABhdmi線02.jpg", order: 1 },
      { productId: hdmiCable.id, url: "/uploads/XLABhdmi線03.jpg", order: 2 },
      { productId: hdmiCable.id, url: "/uploads/XLABhdmi線04.jpg", order: 3 },
      { productId: hdmiCable.id, url: "/uploads/XLABhdmi線05.jpg", order: 4 },
      { productId: hdmiCable.id, url: "/uploads/XLABhdmi線06.jpg", order: 5 },
      { productId: hdmiCable.id, url: "/uploads/XLABhdmi線07.jpg", order: 6 },
    ],
  });
  products.push(hdmiCable);

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
