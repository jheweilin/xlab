"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Mail, Phone, MapPin, Building2 } from "lucide-react";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Contact Us */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t("contact_title") as string}
          </h1>
          <p className="text-white/70 text-lg">
            {t("contact_desc") as string}
          </p>
        </section>

        {/* Email */}
        <section className="mb-12 p-6 rounded-xl border border-white/10 bg-white/5">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-white">
              {t("contact_email_label") as string}
            </h2>
          </div>
          <a
            href={`mailto:${t("contact_email") as string}`}
            className="text-primary hover:underline text-lg"
          >
            {t("contact_email") as string}
          </a>
        </section>

        {/* Contact Info */}
        <section className="p-6 rounded-xl border border-white/10 bg-white/5">
          <h2 className="text-xl font-semibold text-white mb-6">
            {t("contact_info_title") as string}
          </h2>
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-white/50 text-sm mb-1">{t("contact_tax_id_label") as string}: {t("contact_tax_id") as string}</p>
                <p className="text-white text-lg">{t("contact_company") as string}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-white/50 text-sm mb-1">{t("contact_address_label") as string}</p>
                <p className="text-white text-lg">{t("contact_address") as string}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-white/50 text-sm mb-1">{t("contact_phone_label") as string}</p>
                <a
                  href={`tel:${t("contact_phone") as string}`}
                  className="text-white text-lg hover:text-primary transition-colors"
                >
                  {t("contact_phone") as string}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
