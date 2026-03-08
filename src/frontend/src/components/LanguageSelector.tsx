import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/useLanguage";
import { Languages } from "lucide-react";

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  const languageNames = {
    en: t.english,
    ta: t.tamil,
    hi: t.hindi,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-green-300 dark:border-green-800 text-green-900 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-950"
        >
          <Languages className="w-4 h-4 mr-2" />
          {languageNames[language]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white dark:bg-neutral-900 border-green-200 dark:border-green-800"
      >
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={`cursor-pointer ${
            language === "en"
              ? "bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-100"
              : "text-green-700 dark:text-green-300"
          }`}
        >
          {t.english}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("ta")}
          className={`cursor-pointer ${
            language === "ta"
              ? "bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-100"
              : "text-green-700 dark:text-green-300"
          }`}
        >
          {t.tamil}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("hi")}
          className={`cursor-pointer ${
            language === "hi"
              ? "bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-100"
              : "text-green-700 dark:text-green-300"
          }`}
        >
          {t.hindi}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
