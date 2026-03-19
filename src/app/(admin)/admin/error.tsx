"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4 p-8">
        <h1 className="text-2xl font-bold text-white">後台發生錯誤</h1>
        <p className="text-white/60">操作過程中發生了問題。</p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
        >
          重新嘗試
        </button>
      </div>
    </div>
  );
}
