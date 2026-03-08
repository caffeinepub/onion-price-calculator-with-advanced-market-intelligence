import { CropType } from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useLanguage } from "@/hooks/useLanguage";
import {
  useAddMarket,
  useAddPriceRecord,
  useCheckAdmin,
  useGetAllNotifications,
  useGetAllPrices,
  useGetAllUserAlerts,
  useGetAllUserProfiles,
  useGetMarkets,
} from "@/hooks/useQueries";
import { Bell, Database, Plus, Shield, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AdminDashboard() {
  const { t } = useLanguage();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminCheckLoading } = useCheckAdmin();

  const [marketName, setMarketName] = useState("");
  const [marketLocation, setMarketLocation] = useState("");
  const [marketRegion, setMarketRegion] = useState("");

  const [selectedMarket, setSelectedMarket] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<CropType>(CropType.onion);
  const [pricePerKg, setPricePerKg] = useState("");
  const [dataSource, setDataSource] = useState("");

  const { data: markets } = useGetMarkets();
  const { data: allPrices } = useGetAllPrices();
  const { data: allUserProfiles } = useGetAllUserProfiles();
  const { data: allUserAlerts } = useGetAllUserAlerts();
  const { data: allNotifications } = useGetAllNotifications();
  const addMarket = useAddMarket();
  const addPriceRecord = useAddPriceRecord();

  if (!identity) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-6">
            <Shield className="w-16 h-16 mx-auto mb-4 text-green-300 dark:text-green-700" />
            <p className="text-green-700 dark:text-green-300 text-lg">
              {t.loginToAccessAdmin}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (adminCheckLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-6">
            <Shield className="w-12 h-12 mx-auto mb-3 text-green-400 animate-pulse" />
            <p className="text-green-700 dark:text-green-300">
              {t.checkingPermissions}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <Card className="border-2 border-red-200 dark:border-red-900 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-6">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <p className="text-red-700 dark:text-red-300 text-lg font-semibold">
              {t.accessDenied}
            </p>
            <p className="text-red-600 dark:text-red-400 mt-2">
              {t.adminAccessRequired}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddMarket = () => {
    if (!marketName || !marketLocation || !marketRegion) {
      toast.error(t.fillAllFields);
      return;
    }

    addMarket.mutate(
      { name: marketName, location: marketLocation, region: marketRegion },
      {
        onSuccess: () => {
          toast.success(t.marketAdded);
          setMarketName("");
          setMarketLocation("");
          setMarketRegion("");
        },
        onError: () => {
          toast.error(t.marketAddFailed);
        },
      },
    );
  };

  const handleAddPrice = () => {
    if (!selectedMarket || !pricePerKg || !dataSource) {
      toast.error(t.fillAllFields);
      return;
    }

    addPriceRecord.mutate(
      {
        marketId: BigInt(selectedMarket),
        cropType: selectedCrop,
        pricePerKg: BigInt(Math.floor(Number.parseFloat(pricePerKg))),
        source: dataSource,
      },
      {
        onSuccess: () => {
          toast.success(t.priceRecordAdded);
          setSelectedMarket("");
          setPricePerKg("");
          setDataSource("");
        },
        onError: () => {
          toast.error(t.priceRecordAddFailed);
        },
      },
    );
  };

  const totalActiveAlerts =
    allUserAlerts?.reduce(
      (sum, [_, alerts]) => sum + alerts.filter((a) => a.active).length,
      0,
    ) || 0;
  const totalUsers = allUserProfiles?.length || 0;
  const deliveredNotifications =
    allNotifications?.filter((n) => n.delivered).length || 0;
  const totalNotifications = allNotifications?.length || 0;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 mb-4 shadow-lg">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-green-900 dark:text-green-100 mb-3">
          {t.adminDashboard}
        </h1>
        <p className="text-lg text-green-700 dark:text-green-300">
          {t.manageSystemData}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
              <Database className="w-4 h-4" />
              {t.totalMarkets}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
              {markets?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {t.totalPriceRecords}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
              {allPrices?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t.totalUsers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
              {totalUsers}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              {t.activeAlerts}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
              {totalActiveAlerts}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="markets" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="markets">{t.markets}</TabsTrigger>
          <TabsTrigger value="prices">{t.prices}</TabsTrigger>
          <TabsTrigger value="system">{t.system}</TabsTrigger>
        </TabsList>

        <TabsContent value="markets">
          <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-green-900 dark:text-green-100 flex items-center gap-2">
                <Plus className="w-6 h-6" />
                {t.addNewMarket}
              </CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                {t.createMarketEntry}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-green-900 dark:text-green-100 font-medium">
                  {t.marketName}
                </Label>
                <Input
                  value={marketName}
                  onChange={(e) => setMarketName(e.target.value)}
                  placeholder={t.enterMarketName}
                  className="border-green-300 dark:border-green-800 bg-white dark:bg-neutral-950"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-green-900 dark:text-green-100 font-medium">
                  {t.location}
                </Label>
                <Input
                  value={marketLocation}
                  onChange={(e) => setMarketLocation(e.target.value)}
                  placeholder={t.enterLocation}
                  className="border-green-300 dark:border-green-800 bg-white dark:bg-neutral-950"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-green-900 dark:text-green-100 font-medium">
                  {t.region}
                </Label>
                <Input
                  value={marketRegion}
                  onChange={(e) => setMarketRegion(e.target.value)}
                  placeholder={t.enterRegion}
                  className="border-green-300 dark:border-green-800 bg-white dark:bg-neutral-950"
                />
              </div>

              <Button
                onClick={handleAddMarket}
                disabled={addMarket.isPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {addMarket.isPending ? t.adding : t.addMarket}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prices">
          <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-green-900 dark:text-green-100 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                {t.addPriceRecord}
              </CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                {t.recordNewPrice}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-green-900 dark:text-green-100 font-medium">
                  {t.selectMarket}
                </Label>
                <Select
                  value={selectedMarket}
                  onValueChange={setSelectedMarket}
                >
                  <SelectTrigger className="border-green-300 dark:border-green-800 bg-white dark:bg-neutral-950">
                    <SelectValue placeholder={t.chooseMarket} />
                  </SelectTrigger>
                  <SelectContent>
                    {markets?.map((market) => (
                      <SelectItem
                        key={market.id.toString()}
                        value={market.id.toString()}
                      >
                        {market.name}
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
                    <SelectItem value={CropType.groundnut}>
                      {t.groundnut}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-green-900 dark:text-green-100 font-medium">
                  {t.pricePerKg}
                </Label>
                <Input
                  type="number"
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(e.target.value)}
                  placeholder="0"
                  className="border-green-300 dark:border-green-800 bg-white dark:bg-neutral-950"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-green-900 dark:text-green-100 font-medium">
                  {t.dataSource}
                </Label>
                <Input
                  value={dataSource}
                  onChange={(e) => setDataSource(e.target.value)}
                  placeholder={t.enterDataSource}
                  className="border-green-300 dark:border-green-800 bg-white dark:bg-neutral-950"
                />
              </div>

              <Button
                onClick={handleAddPrice}
                disabled={addPriceRecord.isPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {addPriceRecord.isPending ? t.adding : t.addPrice}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-green-900 dark:text-green-100">
                {t.systemOverview}
              </CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                {t.currentSystemStats}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border-2 border-green-200 dark:border-green-800 rounded-lg bg-white dark:bg-neutral-950">
                  <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                    {t.notificationDelivery}
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {totalNotifications > 0
                      ? Math.round(
                          (deliveredNotifications / totalNotifications) * 100,
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {deliveredNotifications} / {totalNotifications}{" "}
                    {t.delivered}
                  </p>
                </div>

                <div className="p-4 border-2 border-green-200 dark:border-green-800 rounded-lg bg-white dark:bg-neutral-950">
                  <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                    {t.systemStatus}
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {t.operational}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {t.allSystemsRunning}
                  </p>
                </div>
              </div>

              <div className="p-4 border-2 border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-neutral-950">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                  {t.recentActivity}
                </h3>
                <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                  <p>
                    • {totalUsers} {t.registeredUsers}
                  </p>
                  <p>
                    • {totalActiveAlerts} {t.activeAlertsMonitoring}
                  </p>
                  <p>
                    • {allPrices?.length || 0} {t.priceRecordsStored}
                  </p>
                  <p>
                    • {markets?.length || 0} {t.marketsConfigured}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
