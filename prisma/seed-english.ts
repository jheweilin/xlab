import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateProduct(slug: string, data: { nameEn: string; descriptionEn: string; contentEn: string; tagsEn: string }) {
  try {
    await prisma.product.update({ where: { slug }, data });
    console.log(`  ✅ ${slug}`);
  } catch {
    console.log(`  ⚠️  ${slug} not found, skipping`);
  }
}

async function updateCategory(slug: string, data: { nameEn: string; descriptionEn: string }) {
  try {
    await prisma.category.update({ where: { slug }, data });
    console.log(`  ✅ ${slug}`);
  } catch {
    console.log(`  ⚠️  ${slug} not found, skipping`);
  }
}

async function main() {
  console.log("🌐 Adding English translations...\n");

  console.log("Categories:");
  await updateCategory("charging-accessories", {
    nameEn: "Charging Accessories",
    descriptionEn: "Fast charging cables, chargers, and charging accessories",
  });
  await updateCategory("protection-accessories", {
    nameEn: "Protection Accessories",
    descriptionEn: "Watch cases, lens protectors, and protective accessories",
  });
  await updateCategory("audio-accessories", {
    nameEn: "Audio Accessories",
    descriptionEn: "Wired earphones and audio accessories",
  });
  await updateCategory("av-accessories", {
    nameEn: "AV Accessories",
    descriptionEn: "HDMI cables, AV transmission cables, and audiovisual accessories",
  });
  await updateCategory("lifestyle-accessories", {
    nameEn: "Lifestyle Accessories",
    descriptionEn: "Handheld fans, phone mounts, and everyday tech accessories",
  });

  console.log("\nProducts:");

  await updateProduct("xlab-charging-cable", {
    nameEn: "XLAB Braided Charging & Data Cable",
    descriptionEn: "PD fast charging with braided durability — withstands 15,000+ bends! Supports Type-C / USB-A / Lightning connectors.",
    contentEn: `[This product is covered by product liability insurance]

Features:
• PD Fast Charging: Supports fast charge protocols with high power output
• 480Mbps Data Sync: Dual-purpose charging & data transfer
• 15,000+ Bend Lifespan: Reinforced connectors with thickened strain relief
• High-Density Nylon Braiding: Tangle-free, wear-resistant, solid grip
• Voltage Stabilization Chip: Smart temperature/current control for device safety

Specifications:
• Transfer Speed: Up to 480Mbps (USB 2.0)
• Durability: Bend test ≥ 15,000 times
• Jacket: High-density nylon braiding
• Conductor: High-purity copper
• Color: Classic Black

Connector Types & Wattage:
• USB-A to Type-C: Up to 18W
• USB-A to Lightning: Up to 12W
• Type-C to Lightning: Up to 20W
• Type-C to Type-C: Up to 45W/65W/100W

※ Actual power and fast charge performance depends on device and charger compatibility`,
    tagsEn: "Fast Charge,Braided Cable,Durable",
  });

  await updateProduct("xlab-charger-20w", {
    nameEn: "XLAB 20W GaN Fast Charger",
    descriptionEn: "Dual-port fast charging — USB-A + Type-C output. GaN gallium nitride technology for a more compact and efficient charger!",
    contentEn: `[This product is covered by product liability insurance]

Features:
• Dual-Port Fast Charging: USB-A + Type-C, charge two devices simultaneously
• GaN Technology: Better heat dissipation, higher efficiency, more compact
• Up to 20W Total: Single port supports PD fast charging up to 20W
• Multiple Safety Protections: Over-current, over-voltage, over-heat, overload, short circuit, overcharge
• Universal Voltage: AC 110–240V
• Lightweight & Portable: Only ~55g

Specifications:
• Model: PDM20W-SCA-MF12M
• Dimensions: 52 × 27 × 45mm
• Weight: ~55g
• Output Ports: Type-C ×1, USB-A ×1
• Type-C Output: 5V⎓3A, 9V⎓2.22A, 12V⎓1.67A
• USB-A Output: 5V⎓3A, 9V⎓2A, 12V⎓1.5A
• Protocols: PD3.0 / QC3.0 / Apple 18W・20W
• Certification: BSMI R3H180`,
    tagsEn: "Charger,GaN,20W",
  });

  await updateProduct("xlab-charger-35w", {
    nameEn: "XLAB 35W GaN Fast Charger",
    descriptionEn: "Supports iPhone 17 series fast charging! Dual-port design, up to 35W total. GaN technology — compact and efficient.",
    contentEn: `[This product is covered by product liability insurance]

Features:
• Dual-Port Fast Charging: USB-A + Type-C
• GaN Technology: More compact, more efficient
• Up to 35W Total: Supports iPhone 17 Pro Max 36W fast charging
• Multiple Safety Protections: Comprehensive protection
• Universal Voltage: AC 110–220V
• Lightweight & Portable: Only ~65g

Specifications:
• Model: PDM35W-SCA-MF12M
• Dimensions: 48 × 26 × 41mm
• Weight: ~65g
• Type-C Output: 5V⎓3A, 9V⎓3A, 12V⎓2.92A, 15V⎓2.33A, 20V⎓1.75A
• USB-A Output: 5V⎓3A, 9V⎓3A, 12V⎓2.5A, 20V⎓1.5A
• Protocols: PD3.0 / QC3.0 / Apple 35W
• Certification: BSMI R3H180`,
    tagsEn: "Charger,GaN,35W,iPhone17",
  });

  await updateProduct("xlab-charger-65w", {
    nameEn: "XLAB 65W GaN Fast Charger",
    descriptionEn: "Triple-port output! Type-C ×2 + USB-A, up to 65W total — charge your laptop and phone simultaneously.",
    contentEn: `[This product is covered by product liability insurance]

Specifications:
• Model: PDM65W-SCA-MF12M
• Output Ports: Type-C ×2, USB-A ×1
• Input: AC110-220V, 50/60Hz 1.5A Max

Single Port Output:
• Type-C1: 5V⎓3A, 9V⎓3A, 12V⎓3A, 15V⎓3A, 20V⎓3.25A (65W)
• Type-C2: 5V⎓3A, 9V⎓2.22A, 12V⎓1.67A (20W)
• USB-A: 5V⎓3A, 9V⎓2A, 12V⎓1.5A (18W)

Simultaneous Output:
• Type-C1 + Type-C2: 45W + 20W
• Type-C1 + USB-A: 45W + 18W
• Type-C2 + USB-A: 5V⎓3A (15W)
• All Three Ports: 45W + 15W`,
    tagsEn: "Charger,GaN,65W,Triple-Port",
  });

  await updateProduct("xlab-4in1-cable", {
    nameEn: "XLAB 4-in-1 Magnetic 65W Charging Cable",
    descriptionEn: "65W PD fast charging × 4-in-1 connectors. USB-A/Type-C input to Lightning/Type-C output. Magnetic storage for a tidy setup!",
    contentEn: `[This product is covered by product liability insurance]

Features:
• 4-in-1 Versatility: USB-A/Type-C input, freely connect to Lightning/Type-C
• 65W Max Fast Charging: Supports 3A high current and PD fast charge
• Magnetic Storage: Built-in magnets for self-coiling cable management
• Enhanced Durability: Zinc alloy connectors + nylon braided jacket
• Data Sync: USB 2.0 up to 480Mbps

Specifications:
• Material: Zinc alloy connectors, nylon braided cable
• Cable Length: 1 meter
• Output Power: 65W Max
• Transfer Speed: Up to 480Mbps

Connector Power Reference:
• Type-C → Type-C: Android 66W / iPhone 27W
• Type-C → Lightning: 27W Max
• USB-A → Lightning: 12W Max
• USB-A → Type-C: 66W Max`,
    tagsEn: "4-in-1,Magnetic,65W",
  });

  await updateProduct("xlab-apple-watch-case", {
    nameEn: "XLAB Apple Watch Waterproof Full-Cover Case",
    descriptionEn: "Suit up your Apple Watch with waterproof armor! Triple protection: waterproof, shockproof, scratch-resistant. Supports S4–S11/SE.",
    contentEn: `Features:

• 360° Waterproof Protection
Precision sealed structure for all-round waterproof and anti-fog protection

• Military-Grade Shockproof
One-piece wraparound design, effectively resists bumps, scratches, and drops

• 9H Tempered Glass Screen
Explosion-proof, scratch-resistant, responsive touch, anti-fingerprint coating

• Charging & Sensors Unaffected
Precise cutouts support magnetic charging and health monitoring

• Skin-Friendly & Comfortable
High-quality PC + soft rubber, lightweight with breathable holes

Specifications:
• Material: PC
• Compatible: Apple Watch S11/10/9/8/7/6/5/4/SE
• Sizes: 40mm / 41mm / 44mm / 45mm / 46mm / 49mm
• Contents: Case + Back Cover`,
    tagsEn: "Apple Watch,Waterproof,Case",
  });

  await updateProduct("xlab-lens-protector", {
    nameEn: "XLAB Precision-Fit Lens Protector",
    descriptionEn: "Protect your iPhone camera lens! Aluminum alloy + tempered glass, superior scratch resistance. Compatible with iPhone 14–17 series.",
    contentEn: `Features:

• Tough Protection: Special manufacturing process, superior scratch resistance
• Bubble-Free Application: Static adsorption technology prevents bubbles
• High Transparency: Crystal clear, preserves true image quality
• Multiple Colors: Silver, Titanium Gray, Titanium Brown
• Premium Materials: Aluminum alloy frame + tempered glass lens

Package Contents:
• 2-lens models → 2 pcs/set
• 3-lens models → 3 pcs/set

Compatible Models:
• iPhone 14/14 Plus/14 Pro/14 Pro Max
• iPhone 15/15 Plus/15 Pro/15 Pro Max
• iPhone 16/16 Plus/16 Pro/16 Pro Max/16e
• iPhone 17/17 Air/17 Pro/17 Pro Max

Material: Tempered Glass`,
    tagsEn: "Lens Protector,iPhone,Screen Protector",
  });

  await updateProduct("xlab-wired-earphone", {
    nameEn: "XLAB Wired In-Ear Earphones with Mic",
    descriptionEn: "A must-have for music lovers! Three connector options (Type-C/Lightning/3.5mm), HD audio + clear calls, ergonomic in-ear design.",
    contentEn: `Features:

• Three Connector Options
Type-C / Lightning / 3.5mm available for a wide range of devices

• Convenient In-Line Controls
3-button: volume, track skip, play/pause

• 10mm HD Driver, Powerful Bass
Stereo surround with clear details and layered soundstage

• Built-in High-Sensitivity Microphone
Clear calls with stable noise reduction

• Ergonomic In-Ear Design
Comfortable and secure for extended wear

Specifications:
• Connector: Type-C / Lightning / 3.5mm
• Color: White
• Cable Length: ~1.2m
• Material: TPE

※ Volume control may not work on some Android phones
※ May not be compatible with third-party adapters`,
    tagsEn: "Wired Earphones,In-Ear,Mic",
  });

  await updateProduct("xlab-magsafe-power-bank", {
    nameEn: "XLAB Ultra-Thin MagSafe Power Bank",
    descriptionEn: "Magnetic charging + Type-C port — ultra-portable! PD fast charge up to 20W, ultra-slim lightweight design.",
    contentEn: `Features:
1. MagSafe Magnetic / Type-C Bidirectional Charging
PD fast charge up to 20W (wired), 15W (wireless).
2. 5000mAh Compact / 10000mAh Large Capacity
Extended battery life for daily needs.
3. Ultra-Thin & Lightweight
Aluminum alloy shell + curved design.
4. Multi-Device Support
Type-C dual I/O, includes cable, compatible with Apple/Android/earbuds.
5. Multiple Circuit Protection
Premium cells with overcharge and short circuit protection.
6. Precise Alignment
Slim, minimalist design that won't block your camera.

Specifications:
Color: Titanium
Input: Type-C: 5V 3A / 9V 2A
Output: Type-C: 9V 2.22A / 12V 1.67A
Wireless: 5W / 7.5W / 10W / 15W
Multi-Port: Wireless 5W + Type-C 5V 2A
Material: Aluminum alloy, plastic, electronic components`,
    tagsEn: "Power Bank,MagSafe,Magnetic,Fast Charge",
  });

  await updateProduct("xlab-mini-handheld-fan", {
    nameEn: "XLAB Ultra-Mini Handheld Fan",
    descriptionEn: "Summer essential! 85g ultra-lightweight, 5-speed adjustment, HD LED battery display, Type-C fast charging.",
    contentEn: `Features:
1. 5-Speed Wind Adjustment
From gentle breeze to powerful airflow.
2. 85g Ultra-Lightweight
102×39×43mm, fits in your pocket.
3. HD LED Display
Real-time speed and battery level.
4. Type-C Fast Charging
Works with power banks and phone chargers.
5. Brushless Motor
Energy-efficient with strong airflow.
6. Handheld + Lanyard
For handheld or neck use — great for shopping and camping.
7. Safety Guard
Protective mesh prevents blade contact.

Specifications:
Model: G027 / H02
Speed: 5 levels
Battery: 3000mAh
Charging: Type-C (DC5V/2A)
Size: 102 × 39 × 43mm
Weight: ~85g
Colors: Black / Orange / Green`,
    tagsEn: "Handheld Fan,Mini,USB Fan",
  });

  await updateProduct("xlab-vacuum-phone-mount", {
    nameEn: "XLAB Vacuum Magnetic Phone Mount",
    descriptionEn: "Ring magnets + vacuum boost — rock-solid on bumpy roads. One-hand operation, 360° rotation. Perfect for navigation and streaming.",
    contentEn: `Features:
1. Ring Magnet Grip: Large surface, even force — stable during braking and bumps.
2. One-Hand Operation: Snap on, lift off — safer driving.
3. 360° Rotation: Landscape/portrait, adjustable angle.
4. Touch-Activated Vacuum: Built-in motor, tap to boost suction.
5. Sealed Vacuum: Large suction cup, long-lasting hold.
6. Anti-Shake Buffer: Stable on rough roads.
7. Smart Lock/Unlock: One-button release.
8. Alloy Body: Durable, premium feel.
9. Large Battery: Extended use between charges.
10. Wide Compatibility: 4–7.2 inch phones.

Installation: Vacuum suction cup (dashboard/windshield)
Adjustment: 360° ball-head rotation
Material: Alloy + strong magnet + weather-resistant suction cup
Compatibility: 4–7.2 inch phones
Power: Built-in rechargeable battery

※ For non-MagSafe phones, use a metal/magnetic ring for best grip.`,
    tagsEn: "Phone Mount,Car Mount,Magnetic,Vacuum",
  });

  await updateProduct("xlab-hdmi-cable", {
    nameEn: "XLAB HDMI AV Cable",
    descriptionEn: "4K/60Hz · 18Gbps high-speed stable. HDR vivid colors, smoother visuals! HDMI 2.0, backward compatible with 1.4/1.2.",
    contentEn: `Features:
1. 4K Ultra HD: 4K/60Hz + HDR — richer colors, stunning visuals.
2. 18Gbps High-Speed: HDMI 2.0 — no stuttering, low latency.
3. Audio-Video Sync: Simultaneous output for immersive experience.
4. Anti-Interference: OFC copper + 5-layer shielding + braid.
5. Extra Durable: Thick cable + heavy-duty PVC jacket.

Specifications:
Interface: HDMI A-to-A (Male-to-Male)
Lengths: 1m / 1.8m / 3m
Materials:
• 24K Gold-Plated Connectors
• High-Purity OFC Copper Conductor
• 19+1 Full-Pin Configuration
• 5 Aluminum Foil Shields + Outer Braid
• Thick PVC Jacket
Compatibility: HDMI 1.4/1.2 backward compatible
Supports: 4K/60Hz, HDR, 3D, BT.2020, ARC

Use Cases:
• Home Theater: TV, sound system, set-top box
• Gaming: PS5, Xbox, Switch
• Meetings: Laptop to projector
• Commercial: Digital signage, LED displays`,
    tagsEn: "HDMI,4K,AV Cable",
  });

  console.log("\n🎉 All English translations added!");
}

main()
  .catch((e) => {
    console.error("❌ Failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
