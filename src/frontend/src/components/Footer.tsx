import { useLanguage } from "@/hooks/useLanguage";
import { Heart } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-green-200 dark:border-green-900 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-green-700 dark:text-green-300">
          <p className="flex items-center justify-center gap-1.5">
            © 2025. {t.builtWith}{" "}
            <Heart className="w-4 h-4 fill-green-600 text-green-600 inline-block" />{" "}
            {t.using}{" "}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-green-900 dark:text-green-100 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
