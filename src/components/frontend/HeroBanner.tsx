"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function HeroBanner() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-xlab-darker">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/30 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-xlab-red/30 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-xlab-red animate-pulse" />
            <span className="text-white/80 text-sm">{t("hero_badge") as string}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {t("hero_title_1") as string}{" "}
            <span className="text-gradient">
              {t("hero_title_2") as string}
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/60 mb-8 max-w-2xl">
            {t("hero_desc") as string}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-xlab hover:opacity-90 text-white"
            >
              <Link href="/products">
                {t("hero_browse") as string}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Link href="/categories">{t("hero_categories") as string}</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">
            <div>
              <div className="text-3xl font-bold text-white">1000+</div>
              <div className="text-white/60 text-sm">{t("hero_stat_products") as string}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-white/60 text-sm">{t("hero_stat_brands") as string}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">24hr</div>
              <div className="text-white/60 text-sm">{t("hero_stat_shipping") as string}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
