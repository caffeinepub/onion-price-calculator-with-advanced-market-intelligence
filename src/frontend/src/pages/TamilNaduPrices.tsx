import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { Award, MapPin, Search, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Crop types - only Onion and Groundnut
type CropType = "Onion" | "Groundnut";

// Mock data structure for Tamil Nadu prices
interface TNPrice {
  id: string;
  market: string;
  cropType: CropType;
  pricePerUnit: number; // per kg for Onion, per drum for Groundnut
  lastUpdated: Date;
}

// Generate mock data for Tamil Nadu markets
const generateTNMockData = (): TNPrice[] => {
  const tnMarkets = [
    "Chennai Koyambedu Market",
    "Coimbatore Market",
    "Madurai Market",
    "Tiruchirappalli Market",
    "Salem Market",
    "Tirunelveli Market",
    "Erode Market",
    "Vellore Market",
    "Thanjavur Market",
    "Dindigul Market",
    "Karur Market",
    "Namakkal Market",
  ];

  const mockData: TNPrice[] = [];
  let idCounter = 1;

  // Generate prices for Onion (per kg)
  for (const market of tnMarkets) {
    const onionPrice = Math.floor(Math.random() * 40) + 20; // ₹20-60 per kg
    mockData.push({
      id: `${idCounter++}`,
      market,
      cropType: "Onion",
      pricePerUnit: onionPrice,
      lastUpdated: new Date(),
    });
  }

  // Generate prices for Groundnut (per drum)
  for (const market of tnMarkets) {
    const groundnutPrice = Math.floor(Math.random() * 30) + 60; // ₹60-90 per drum
    mockData.push({
      id: `${idCounter++}`,
      market,
      cropType: "Groundnut",
      pricePerUnit: groundnutPrice,
      lastUpdated: new Date(),
    });
  }

  return mockData;
};

const mockTNPrices: TNPrice[] = generateTNMockData();

export function TamilNaduPrices() {
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<CropType>("Onion");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter prices based on selected crop and search
  const filteredPrices = useMemo(() => {
    return mockTNPrices.filter((price) => {
      const cropMatch = price.cropType === selectedCrop;
      const searchMatch =
        searchQuery === "" ||
        price.market.toLowerCase().includes(searchQuery.toLowerCase());

      return cropMatch && searchMatch;
    });
  }, [selectedCrop, searchQuery]);

  // Sort by price descending
  const sortedPrices = useMemo(() => {
    return [...filteredPrices].sort((a, b) => b.pricePerUnit - a.pricePerUnit);
  }, [filteredPrices]);

  // Get highest price for selected crop
  const highestPrice = useMemo(() => {
    return sortedPrices.length > 0 ? sortedPrices[0] : null;
  }, [sortedPrices]);

  // Prepare chart data (top 10 markets)
  const chartData = useMemo(() => {
    return sortedPrices.slice(0, 10).map((price) => ({
      name: price.market.split(" ")[0], // Shortened name for chart
      price: price.pricePerUnit,
      fullName: price.market,
    }));
  }, [sortedPrices]);

  const getUnitLabel = (crop: CropType): string => {
    return crop === "Onion" ? t.perKg : t.perDrum;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <TrendingUp className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-green-900 dark:text-green-100">
            {t.tamilNaduPrices}
          </h1>
        </div>
        <p className="text-green-700 dark:text-green-300">
          {t.tamilNaduPricesDescription}
        </p>
      </div>

      {/* Crop Tabs */}
      <Tabs
        value={selectedCrop}
        onValueChange={(value) => setSelectedCrop(value as CropType)}
      >
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="Onion">{t.crops.Onion}</TabsTrigger>
          <TabsTrigger value="Groundnut">{t.crops.Groundnut}</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCrop} className="space-y-6 mt-6">
          {/* Highest Price Card */}
          {highestPrice && (
            <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
                  <Award className="w-5 h-5 text-yellow-500" />
                  {t.highestPrice} - {t.crops[selectedCrop]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    ₹{highestPrice.pricePerUnit}/{getUnitLabel(selectedCrop)}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <MapPin className="w-4 h-4" />
                    <span>{highestPrice.market}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-900 dark:text-green-100">
                {t.searchMarket}
              </CardTitle>
              <CardDescription>{t.searchTNMarkets}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-600" />
                <Input
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-green-300 dark:border-green-700"
                />
              </div>
            </CardContent>
          </Card>

          {/* Price Chart */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-900 dark:text-green-100">
                {t.topTNMarketsByPrice}
              </CardTitle>
              <CardDescription>{t.topMarketsDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                    <XAxis
                      dataKey="name"
                      stroke="#059669"
                      tick={{ fill: "#059669" }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      stroke="#059669"
                      tick={{ fill: "#059669" }}
                      label={{
                        value:
                          selectedCrop === "Onion"
                            ? t.pricePerKg
                            : t.pricePerDrum,
                        angle: -90,
                        position: "insideLeft",
                        fill: "#059669",
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#f0fdf4",
                        border: "1px solid #86efac",
                        borderRadius: "8px",
                      }}
                      labelFormatter={(label, payload) => {
                        if (payload?.[0]) {
                          return payload[0].payload.fullName;
                        }
                        return label;
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="price"
                      fill="#10b981"
                      name={
                        selectedCrop === "Onion" ? t.pricePerKg : t.pricePerDrum
                      }
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-green-600 dark:text-green-400">
                  {t.noDataAvailable}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Price Table */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-900 dark:text-green-100">
                {t.priceByMarket}
              </CardTitle>
              <CardDescription>
                {t.showingResults.replace(
                  "{count}",
                  sortedPrices.length.toString(),
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sortedPrices.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-green-200 dark:border-green-800">
                        <TableHead className="text-green-700 dark:text-green-300">
                          {t.market}
                        </TableHead>
                        <TableHead className="text-green-700 dark:text-green-300 text-right">
                          {selectedCrop === "Onion"
                            ? t.pricePerKg
                            : t.pricePerDrum}
                        </TableHead>
                        <TableHead className="text-green-700 dark:text-green-300">
                          {t.lastUpdated}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedPrices.map((price) => (
                        <TableRow
                          key={price.id}
                          className="border-green-100 dark:border-green-900"
                        >
                          <TableCell className="font-medium text-green-900 dark:text-green-100">
                            {price.market}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-green-700 dark:text-green-300">
                            ₹{price.pricePerUnit}
                          </TableCell>
                          <TableCell className="text-sm text-green-600 dark:text-green-400">
                            {price.lastUpdated.toLocaleTimeString(
                              t.dateTimeFormat.locale,
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-green-600 dark:text-green-400">
                  {t.noResultsFound}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
