"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white/80 hover:text-white text-sm"
      title={locale === "zh" ? "Switch to English" : "切換為中文"}
    >
      <Globe className="w-4 h-4" />
      <span>{locale === "zh" ? "EN" : "中"}</span>
    </button>
  );
}
