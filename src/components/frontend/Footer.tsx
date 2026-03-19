"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-xlab-darker border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/">
              <Logo size="md" />
            </Link>
            <p className="text-white/60 text-sm">
              {t("footer_desc") as string}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t("footer_quick_links") as string}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {t("footer_home") as string}
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {t("footer_all_products") as string}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {t("footer_categories") as string}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t("footer_support") as string}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {t("footer_faq") as string}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {t("footer_return_policy") as string}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {t("footer_contact_us") as string}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t("footer_contact_info") as string}</h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>service@xlab.com</li>
              <li>(02) 1234-5678</li>
              <li>{t("footer_address") as string}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} Xlab. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-white/40 hover:text-white transition-colors text-sm"
            >
              {t("footer_privacy") as string}
            </Link>
            <Link
              href="#"
              className="text-white/40 hover:text-white transition-colors text-sm"
            >
              {t("footer_terms") as string}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
