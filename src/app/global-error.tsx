"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-TW" className="dark">
      <body className="bg-gray-950 text-white flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-4xl font-bold">系統發生錯誤</h1>
          <p className="text-white/60">很抱歉，系統遇到了一些問題。</p>
          <button
            onClick={reset}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            重新嘗試
          </button>
        </div>
      </body>
    </html>
  );
}
