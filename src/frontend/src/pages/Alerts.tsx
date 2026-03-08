import { CropType } from "@/backend";
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useLanguage } from "@/hooks/useLanguage";
import {
  useCreateAlert,
  useDeleteAlert,
  useGetMarkets,
  useGetUserAlerts,
  useToggleAlert,
} from "@/hooks/useQueries";
import { Bell, Plus, Power, PowerOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Alerts() {
  const { t } = useLanguage();
  const { identity } = useInternetIdentity();
  const [selectedMarket, setSelectedMarket] = useState<string>("");
  const [selectedCrop, setSelectedCrop] = useState<CropType>(CropType.onion);
  const [targetPrice, setTargetPrice] = useState("");
  const [alertAbove, setAlertAbove] = useState(true);

  const { data: markets } = useGetMarkets();
  const { data: alerts, isLoading: alertsLoading } = useGetUserAlerts();
  const createAlert = useCreateAlert();
  const toggleAlert = useToggleAlert();
  const deleteAlert = useDeleteAlert();

  if (!identity) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-6">
            <Bell className="w-16 h-16 mx-auto mb-4 text-green-300 dark:text-green-700" />
            <p className="text-green-700 dark:text-green-300 text-lg">
              {t.loginToManageAlerts}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateAlert = () => {
    if (!selectedMarket || !targetPrice) {
      toast.error(t.fillAllFields);
      return;
    }

    createAlert.mutate(
      {
        marketId: BigInt(selectedMarket),
        cropType: selectedCrop,
        targetPrice: BigInt(Math.floor(Number.parseFloat(targetPrice))),
        above: alertAbove,
      },
      {
        onSuccess: () => {
          toast.success(t.alertCreated);
          setSelectedMarket("");
          setTargetPrice("");
        },
        onError: (error: any) => {
          if (error.message?.includes("Duplicate alert")) {
            toast.error(t.duplicateAlert);
          } else {
            toast.error(t.alertCreationFailed);
          }
        },
      },
    );
  };

  const handleToggleAlert = (alert: any) => {
    toggleAlert.mutate(
      {
        marketId: alert.marketId,
        cropType: alert.cropType,
        targetPrice: alert.targetPrice,
        above: alert.above,
      },
      {
        onSuccess: () => {
          toast.success(alert.active ? t.alertDeactivated : t.alertActivated);
        },
        onError: () => {
          toast.error(t.alertToggleFailed);
        },
      },
    );
  };

  const handleDeleteAlert = (alert: any) => {
    deleteAlert.mutate(
      {
        marketId: alert.marketId,
        cropType: alert.cropType,
        targetPrice: alert.targetPrice,
        above: alert.above,
      },
      {
        onSuccess: () => {
          toast.success(t.alertDeleted);
        },
        onError: () => {
          toast.error(t.alertDeleteFailed);
        },
      },
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 mb-4 shadow-lg">
          <Bell className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-green-900 dark:text-green-100 mb-3">
          {t.priceAlerts}
        </h1>
        <p className="text-lg text-green-700 dark:text-green-300">
          {t.manageYourAlerts}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-green-900 dark:text-green-100 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              {t.createNewAlert}
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              {t.setUpPriceAlert}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-green-900 dark:text-green-100 font-medium">
                {t.selectMarket}
              </Label>
              <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                <SelectTrigger className="border-green-300 dark:border-green-800 bg-white dark:bg-neutral-950">
                  <SelectValue placeholder={t.chooseMarket} />
                </SelectTrigger>
                <SelectContent>
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
                  <SelectItem value={CropType.groundnut}>
                    {t.groundnut}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-green-900 dark:text-green-100 font-medium">
                {t.targetPrice}
              </Label>
              <Input
                type="number"
                placeholder="0"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="border-green-300 dark:border-green-800 bg-white dark:bg-neutral-950"
              />
            </div>

            <div className="flex items-center justify-between p-4 border-2 border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-neutral-950">
              <Label className="text-green-900 dark:text-green-100 font-medium">
                {alertAbove
                  ? t.alertWhenPriceGoesAbove
                  : t.alertWhenPriceGoesBelow}
              </Label>
              <Switch checked={alertAbove} onCheckedChange={setAlertAbove} />
            </div>

            <Button
              onClick={handleCreateAlert}
              disabled={
                createAlert.isPending || !selectedMarket || !targetPrice
              }
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {createAlert.isPending ? t.creating : t.createAlert}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-green-900 dark:text-green-100">
              {t.yourAlerts}
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              {t.manageExistingAlerts}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {alertsLoading ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 mx-auto mb-3 text-green-400 animate-pulse" />
                <p className="text-green-700 dark:text-green-300">
                  {t.loadingAlerts}
                </p>
              </div>
            ) : alerts && alerts.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {alerts.map((alert, index) => {
                  const market = markets?.find((m) => m.id === alert.marketId);
                  const alertKey = `${alert.marketId.toString()}-${String(alert.cropType)}-${alert.targetPrice.toString()}-${index}`;
                  return (
                    <div
                      key={alertKey}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        alert.active
                          ? "border-green-300 dark:border-green-700 bg-white dark:bg-neutral-950"
                          : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-neutral-900 opacity-60"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-green-900 dark:text-green-100">
                              {market?.name || t.unknownMarket}
                            </p>
                            <Badge
                              variant={alert.active ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {alert.active ? t.active : t.inactive}
                            </Badge>
                          </div>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            {alert.cropType === CropType.onion
                              ? t.onion
                              : t.groundnut}
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400 mt-1 font-medium">
                            {alert.above
                              ? `↑ ${t.alertAbove}`
                              : `↓ ${t.alertBelow}`}{" "}
                            ₹{Number(alert.targetPrice)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleAlert(alert)}
                            disabled={toggleAlert.isPending}
                            className="border-green-300 dark:border-green-700"
                          >
                            {alert.active ? (
                              <PowerOff className="w-4 h-4" />
                            ) : (
                              <Power className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteAlert(alert)}
                            disabled={deleteAlert.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 mx-auto mb-4 text-green-300 dark:text-green-700" />
                <p className="text-green-700 dark:text-green-300 text-lg">
                  {t.noAlertsYet}
                </p>
                <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                  {t.createFirstAlert}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
