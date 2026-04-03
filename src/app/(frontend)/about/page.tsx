"use client";

import { useLanguage } from "@/context/LanguageContext";
import { CheckCircle } from "lucide-react";

export default function AboutPage() {
  const { t } = useLanguage();

  const philosophyItems = [
    t("about_philosophy_1"),
    t("about_philosophy_2"),
    t("about_philosophy_3"),
    t("about_philosophy_4"),
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* About Us */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold text-white mb-6">
            {t("about_title") as string}
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            {t("about_desc") as string}
          </p>
        </section>

        {/* Selection Philosophy */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">
            {t("about_philosophy_title") as string}
          </h2>
          <div className="space-y-4 mb-6">
            {philosophyItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-white/70 text-lg">{item as string}</span>
              </div>
            ))}
          </div>
          <p className="text-white/60 text-lg italic border-l-2 border-primary pl-4">
            {t("about_philosophy_desc") as string}
          </p>
        </section>
      </div>
    </div>
  );
}
