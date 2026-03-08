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
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useLanguage } from "@/hooks/useLanguage";
import { useGetTransactions, useSaveTransaction } from "@/hooks/useQueries";
import {
  Calculator as CalcIcon,
  Download,
  Loader2,
  Save,
  Share2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";

type CropType = "onion" | "groundnut";

export function Calculator() {
  const { t } = useLanguage();
  const { identity } = useInternetIdentity();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [cropType, setCropType] = useState<CropType>("onion");
  const [farmerName, setFarmerName] = useState("");
  const [laborName, setLaborName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileError, setMobileError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const saveTransactionMutation = useSaveTransaction();
  const { refetch: fetchTransactions } = useGetTransactions();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalPrice = useMemo(() => {
    const qty = Number.parseFloat(quantity);
    const price = Number.parseFloat(pricePerUnit);
    if (!Number.isNaN(qty) && !Number.isNaN(price) && qty > 0 && price > 0) {
      return (qty * price).toFixed(2);
    }
    return null;
  }, [quantity, pricePerUnit]);

  const formattedDate = currentDateTime.toLocaleDateString(
    t.dateTimeFormat.locale,
    {
      weekday: t.dateTimeFormat.weekday,
      year: t.dateTimeFormat.year,
      month: t.dateTimeFormat.month,
      day: t.dateTimeFormat.day,
    },
  );
  const formattedTime = currentDateTime.toLocaleTimeString(
    t.timeFormat.locale,
    {
      hour: t.timeFormat.hour,
      minute: t.timeFormat.minute,
      second: t.timeFormat.second,
    },
  );

  const quantityLabel =
    cropType === "onion" ? t.totalOnionWeight : t.totalDrumsGroundnut;
  const priceLabel = cropType === "onion" ? t.pricePerKg : t.pricePerDrum;
  const unitLabel = cropType === "onion" ? t.perKg : t.perDrum;
  const cropDisplayName = cropType === "onion" ? t.onion : t.groundnut;

  const createShareMessage = () => {
    return `${t.shareMessage.title}

${t.shareMessage.date}: ${formattedDate}
${t.shareMessage.time}: ${formattedTime}

${t.shareMessage.cropType}: ${cropDisplayName}
${t.shareMessage.farmer}: ${farmerName || t.shareMessage.notSpecified}
${t.shareMessage.labor}: ${laborName || t.shareMessage.notSpecified}

${t.shareMessage.quantity}: ${quantity || "0"} ${cropType === "onion" ? "kg" : t.drums}
${t.shareMessage.price}: ₹${pricePerUnit || "0"} ${unitLabel}

${t.shareMessage.total}: ₹${totalPrice || "0"}`;
  };

  const saveToSpreadsheet = async () => {
    if (!identity) {
      toast.error("Please log in to save transaction data.");
      return;
    }

    const weightKg = Number.parseFloat(quantity) || 0;
    const pricePerKg = Number.parseFloat(pricePerUnit) || 0;
    const totalAmount = Number.parseFloat(totalPrice || "0");
    const timestamp = BigInt(Date.now()) * BigInt(1_000_000); // nanoseconds

    try {
      await saveTransactionMutation.mutateAsync({
        farmerName: farmerName || "",
        laborName: laborName || "",
        weightKg,
        pricePerKg,
        totalAmount,
        mobileNumber: mobileNumber || "",
        timestamp,
      });

      toast.success("Transaction saved securely to the canister!");

      // Reset form fields after successful save
      setFarmerName("");
      setLaborName("");
      setQuantity("");
      setPricePerUnit("");
      setMobileNumber("");
      setMobileError(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save transaction.";
      toast.error(`Error: ${message}`);
    }
  };

  const downloadSpreadsheet = async () => {
    setIsDownloading(true);
    try {
      const result = await fetchTransactions();
      const records = result.data ?? [];

      if (records.length === 0) {
        toast.info("No transactions found to export.");
        return;
      }

      const headers = [
        "Farmer Name",
        "Labor Name",
        "Weight (kg)",
        "Price per kg (₹)",
        "Total Amount (₹)",
        "Mobile Number",
        "Timestamp",
      ];

      const rows = records.map((r) => {
        const date = new Date(Number(r.timestamp) / 1_000_000).toLocaleString();
        return [
          r.farmerName,
          r.laborName,
          r.weightKg.toString(),
          r.pricePerKg.toString(),
          r.totalAmount.toString(),
          r.mobileNumber,
          date,
        ];
      });

      const csvContent = [headers, ...rows]
        .map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
        )
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      link.setAttribute("href", url);
      link.setAttribute("download", `transactions-${today}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${records.length} transaction(s) as CSV.`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to download transactions.";
      toast.error(`Export error: ${message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const shareViaWhatsApp = () => {
    const currentMobile = mobileNumber.trim();
    if (!currentMobile) {
      setMobileError(true);
      return;
    }
    setMobileError(false);
    const message = encodeURIComponent(createShareMessage());
    const url = `https://wa.me/${currentMobile}?text=${message}`;
    window.open(url, "_blank");
  };

  const shareViaSMS = () => {
    const currentMobile = mobileNumber.trim();
    if (!currentMobile) {
      setMobileError(true);
      return;
    }
    setMobileError(false);
    const message = encodeURIComponent(createShareMessage());
    const url = `sms:${currentMobile}?body=${message}`;
    window.location.href = url;
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileNumber(e.target.value);
    if (e.target.value.trim()) {
      setMobileError(false);
    }
  };

  const isFormValid =
    farmerName && laborName && quantity && pricePerUnit && totalPrice;
  const isSaving = saveTransactionMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 mb-4 shadow-lg">
          <CalcIcon className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-green-900 dark:text-green-100 mb-3">
          {t.calculatorTitle}
        </h1>
        <p className="text-lg text-green-700 dark:text-green-300 max-w-2xl mx-auto">
          {t.calculatorSubtitle}
        </p>
      </div>

      <div className="mb-6 text-center">
        <div className="text-sm text-green-700 dark:text-green-300">
          {formattedDate} • {formattedTime}
        </div>
      </div>

      <Card className="mb-6 border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-green-900 dark:text-green-100">
            {t.transactionDetails}
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            {t.enterTransactionInfo}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="cropType"
              className="text-green-900 dark:text-green-100 font-medium"
            >
              {t.selectCrop}
            </Label>
            <Select
              value={cropType}
              onValueChange={(value: CropType) => setCropType(value)}
            >
              <SelectTrigger
                id="cropType"
                className="border-green-300 dark:border-green-800 focus:border-green-500 dark:focus:border-green-600 bg-white dark:bg-neutral-950"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onion">{t.onion}</SelectItem>
                <SelectItem value="groundnut">{t.groundnut}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="farmerName"
                className="text-green-900 dark:text-green-100 font-medium"
              >
                {t.farmerName}
              </Label>
              <Input
                id="farmerName"
                type="text"
                placeholder={t.enterFarmerName}
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="border-green-300 dark:border-green-800 focus:border-green-500 dark:focus:border-green-600 bg-white dark:bg-neutral-950"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="laborName"
                className="text-green-900 dark:text-green-100 font-medium"
              >
                {t.laborName}
              </Label>
              <Input
                id="laborName"
                type="text"
                placeholder={t.enterLaborName}
                value={laborName}
                onChange={(e) => setLaborName(e.target.value)}
                className="border-green-300 dark:border-green-800 focus:border-green-500 dark:focus:border-green-600 bg-white dark:bg-neutral-950"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="quantity"
                className="text-green-900 dark:text-green-100 font-medium"
              >
                {quantityLabel}
              </Label>
              <Input
                id="quantity"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0"
                min="0"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border-green-300 dark:border-green-800 focus:border-green-500 dark:focus:border-green-600 bg-white dark:bg-neutral-950"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="pricePerUnit"
                className="text-green-900 dark:text-green-100 font-medium"
              >
                {priceLabel}
              </Label>
              <Input
                id="pricePerUnit"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0"
                min="0"
                step="0.01"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                className="border-green-300 dark:border-green-800 focus:border-green-500 dark:focus:border-green-600 bg-white dark:bg-neutral-950"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {totalPrice && (
        <Card className="mb-6 border-2 border-green-400 dark:border-green-700 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950 dark:to-emerald-950 shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                {t.totalAmount}
              </div>
              <div className="text-5xl md:text-6xl font-bold text-green-900 dark:text-green-100">
                ₹{totalPrice}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-2">
                {quantity} {cropType === "onion" ? "kg" : t.drums} × ₹
                {pricePerUnit} {unitLabel}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Save to Spreadsheet button + privacy note */}
        <div className="flex flex-col items-stretch gap-1">
          <Button
            onClick={saveToSpreadsheet}
            disabled={!isFormValid || isSaving}
            size="lg"
            variant="outline"
            className="border-2 border-green-700 text-green-800 hover:bg-green-50 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-950 font-semibold py-6 text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            ) : (
              <Save className="w-6 h-6 mr-2" />
            )}
            {isSaving ? "Saving..." : t.saveToSpreadsheet}
          </Button>
          <p className="text-xs text-gray-800 dark:text-gray-200 font-medium text-center mt-1">
            🔒 Farmer data is secure and strictly private.
          </p>
        </div>

        {/* Download Spreadsheet button — visible to all users */}
        <Button
          onClick={downloadSpreadsheet}
          disabled={isDownloading}
          size="lg"
          variant="outline"
          className="border-2 border-green-600 text-green-900 hover:bg-green-100 dark:text-green-100 dark:hover:bg-green-950 font-semibold py-6 text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
          ) : (
            <Download className="w-6 h-6 mr-2" />
          )}
          {isDownloading ? "Exporting..." : t.downloadSpreadsheet}
        </Button>
      </div>

      <Card className="mb-6 border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-xl">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label
              htmlFor="mobileNumber"
              className="text-green-900 dark:text-green-100 font-medium"
            >
              {t.mobileNumber} *
            </Label>
            <Input
              id="mobileNumber"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={t.enterMobileNumber}
              value={mobileNumber}
              onChange={handleMobileChange}
              className={`bg-white dark:bg-neutral-950 ${
                mobileError
                  ? "border-red-500 dark:border-red-500 focus:border-red-500"
                  : "border-green-300 dark:border-green-800 focus:border-green-500 dark:focus:border-green-600"
              }`}
              required
            />
            {mobileError && (
              <p className="text-xs text-red-500 dark:text-red-400">
                {t.mobileNumberRequired}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={shareViaWhatsApp}
            disabled={!isFormValid}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SiWhatsapp className="w-6 h-6 mr-2" />
            {t.shareViaWhatsApp}
          </Button>

          <Button
            onClick={shareViaSMS}
            disabled={!isFormValid}
            size="lg"
            variant="outline"
            className="border-2 border-green-600 text-green-900 hover:bg-green-100 dark:text-green-100 dark:hover:bg-green-950 font-semibold py-6 text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Share2 className="w-6 h-6 mr-2" />
            {t.shareViaSMS}
          </Button>
        </div>
      </div>

      {!isFormValid && totalPrice && (
        <p className="text-center text-sm text-green-600 dark:text-green-400 mt-4">
          {t.fillAllFields}
        </p>
      )}
    </div>
  );
}
