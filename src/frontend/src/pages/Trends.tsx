import { CropType } from "@/backend";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useLanguage } from "@/hooks/useLanguage";
import {
  useGetAllPrices,
  useGetMarkets,
  useGetTrendsData,
} from "@/hooks/useQueries";
import { BarChart3, Calendar, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function Trends() {
  const { t } = useLanguage();
  const { identity } = useInternetIdentity();
  const [selectedMarket, setSelectedMarket] = useState<string>("all");
  const [selectedCrop, setSelectedCrop] = useState<CropType>(CropType.onion);
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">(
    "daily",
  );

  const { data: markets, isLoading: marketsLoading } = useGetMarkets();
  const { data: trendsData, isLoading: trendsLoading } = useGetTrendsData();
  const { data: allPrices } = useGetAllPrices();

  if (!identity) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-6">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-green-300 dark:text-green-700" />
            <p className="text-green-700 dark:text-green-300 text-lg">
              {t.loginToViewTrends}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTrendData = () => {
    if (!trendsData) return [];

    const trends =
      timeframe === "daily"
        ? trendsData.dailyTrends
        : timeframe === "weekly"
          ? trendsData.weeklyTrends
          : trendsData.monthlyTrends;

    return trends.map((trend, index) => ({
      name: `${timeframe === "daily" ? t.daily : timeframe === "weekly" ? t.weekly : t.monthly} ${index + 1}`,
      average: Number(trend.averagePrice),
      min: Number(trend.minPrice),
      max: Number(trend.maxPrice),
    }));
  };

  const chartData = getTrendData();

  const currentTrend =
    trendsData && trendsData.dailyTrends.length > 0
      ? trendsData.dailyTrends[0]
      : null;

  // Calculate trend direction
  const getTrendDirection = () => {
    if (
      !currentTrend ||
      !currentTrend.priceTrend ||
      currentTrend.priceTrend.length < 2
    )
      return "stable";
    const prices = currentTrend.priceTrend.map((p) => Number(p));
    const firstHalf = prices.slice(0, Math.floor(prices.length / 2));
    const secondHalf = prices.slice(Math.floor(prices.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    if (secondAvg > firstAvg * 1.05) return "increasing";
    if (secondAvg < firstAvg * 0.95) return "decreasing";
    return "stable";
  };

  const trendDirection = getTrendDirection();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 mb-4 shadow-lg">
          <TrendingUp className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-green-900 dark:text-green-100 mb-3">
          {t.priceAnalysis}
        </h1>
        <p className="text-lg text-green-700 dark:text-green-300">
          {t.historicalPriceTrends}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <Label className="text-green-900 dark:text-green-100 font-medium">
            {t.selectMarket}
          </Label>
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="border-green-300 dark:border-green-800 bg-white dark:bg-neutral-950">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allMarkets}</SelectItem>
              {markets?.map((market) => (
                <SelectItem
                  key={market.id.toString()}
                  value={market.id.toString()}
                >
                  {market.name} - {market.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-green-900 dark:text-green-100 font-medium">
            {t.selectCrop}
          </Label>
          <Select
            value={selectedCrop}
            onValueChange={(value) => setSelectedCrop(value as CropType)}
          >
            <SelectTrigger className="border-green-300 dark:border-green-800 bg-white dark:bg-neutral-950">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CropType.onion}>{t.onion}</SelectItem>
              <SelectItem value={CropType.groundnut}>{t.groundnut}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-green-900 dark:text-green-100 font-medium">
            {t.timeframe}
          </Label>
          <Select
            value={timeframe}
            onValueChange={(value: any) => setTimeframe(value)}
          >
            <SelectTrigger className="border-green-300 dark:border-green-800 bg-white dark:bg-neutral-950">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">{t.daily}</SelectItem>
              <SelectItem value="weekly">{t.weekly}</SelectItem>
              <SelectItem value="monthly">{t.monthly}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {currentTrend && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-green-700 dark:text-green-300">
                {t.averagePrice}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                ₹{Number(currentTrend.averagePrice)}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {t.perKg}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-green-700 dark:text-green-300">
                {t.minimumPrice}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                ₹{Number(currentTrend.minPrice)}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {t.perKg}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-green-700 dark:text-green-300">
                {t.maximumPrice}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                ₹{Number(currentTrend.maxPrice)}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {t.perKg}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-green-700 dark:text-green-300">
                {t.priceTrend}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  trendDirection === "increasing"
                    ? "text-red-600 dark:text-red-400"
                    : trendDirection === "decreasing"
                      ? "text-green-600 dark:text-green-400"
                      : "text-yellow-600 dark:text-yellow-400"
                }`}
              >
                {trendDirection === "increasing"
                  ? "↑ Rising"
                  : trendDirection === "decreasing"
                    ? "↓ Falling"
                    : "→ Stable"}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {Number(currentTrend.totalRecords)} {t.dataPoints}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-green-900 dark:text-green-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            {t.priceTrends}
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            {t.viewHistoricalData}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trendsLoading || marketsLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-green-400 animate-pulse" />
                <p className="text-green-700 dark:text-green-300">
                  {t.loadingData}
                </p>
              </div>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  stroke="oklch(var(--foreground))"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="oklch(var(--foreground))"
                  style={{ fontSize: "12px" }}
                  label={{
                    value: "Price (₹)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(var(--card))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "8px",
                    color: "oklch(var(--foreground))",
                  }}
                  formatter={(value: number) => [`₹${value}`, ""]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="oklch(0.50 0.12 155)"
                  strokeWidth={3}
                  name={t.average}
                  dot={{ fill: "oklch(0.50 0.12 155)", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="min"
                  stroke="oklch(0.646 0.222 155)"
                  strokeWidth={2}
                  name={t.minimum}
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="max"
                  stroke="oklch(0.828 0.189 140)"
                  strokeWidth={2}
                  name={t.maximum}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-green-300 dark:text-green-700" />
                <p className="text-green-700 dark:text-green-300 text-lg">
                  {t.noDataAvailable}
                </p>
                <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                  {t.addPriceDataToSee}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {allPrices && allPrices.length > 0 && (
        <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-xl mt-6">
          <CardHeader>
            <CardTitle className="text-xl text-green-900 dark:text-green-100">
              {t.recentPriceRecords}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {allPrices.slice(0, 10).map((record) => {
                const market = markets?.find((m) => m.id === record.marketId);
                return (
                  <div
                    key={record.id.toString()}
                    className="flex justify-between items-center p-3 border border-green-200 dark:border-green-800 rounded-lg bg-white dark:bg-neutral-950"
                  >
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">
                        {market?.name || t.unknownMarket}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {record.cropType === CropType.onion
                          ? t.onion
                          : t.groundnut}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-900 dark:text-green-100">
                        ₹{Number(record.pricePerKg)}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {new Date(
                          Number(record.date) / 1000000,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
