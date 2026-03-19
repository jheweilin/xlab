"use client";

import Link from "next/link";

export default function FrontendError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4 p-8">
        <h1 className="text-3xl font-bold text-white">頁面載入失敗</h1>
        <p className="text-white/60">很抱歉，此頁面暫時無法顯示。</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            重新嘗試
          </button>
          <Link
            href="/"
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            回首頁
          </Link>
        </div>
      </div>
    </div>
  );
}
