import { useLanguage } from "@/hooks/useLanguage";
import { Calculator } from "lucide-react";

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="border-b border-green-200 dark:border-green-900 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-md">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-900 dark:text-green-100">
                {t.onionCalculator}
              </h1>
              <p className="text-xs text-green-600 dark:text-green-400">
                {t.fastAndEasy}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
