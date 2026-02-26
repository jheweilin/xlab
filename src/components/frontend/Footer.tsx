import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
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
              探索最新 3C 電子產品，體驗科技生活。提供最優質的產品與服務。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">快速連結</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  首頁
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  所有商品
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  產品分類
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">客戶服務</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  常見問題
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  退換貨政策
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  聯絡我們
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">聯絡資訊</h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>service@xlab.com</li>
              <li>(02) 1234-5678</li>
              <li>台北市信義區信義路五段 7 號</li>
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
              隱私權政策
            </Link>
            <Link
              href="#"
              className="text-white/40 hover:text-white transition-colors text-sm"
            >
              使用條款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
