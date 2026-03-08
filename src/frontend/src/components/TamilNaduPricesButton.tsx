import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Link } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";

export function TamilNaduPricesButton() {
  const { t } = useLanguage();

  return (
    <div className="flex justify-center">
      <Link to="/tn-prices">
        <Button
          size="lg"
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-6 text-lg"
        >
          <TrendingUp className="w-6 h-6 mr-2" />
          {t.tamilNaduPrices}
        </Button>
      </Link>
    </div>
  );
}
