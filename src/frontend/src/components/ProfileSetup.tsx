import type { UserProfile } from "@/backend";
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
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/hooks/useLanguage";
import { useSaveCallerUserProfile } from "@/hooks/useQueries";
import { useState } from "react";

export function ProfileSetup() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const profile: UserProfile = {
      name,
      notificationPreferences: {
        pushEnabled,
        smsEnabled,
        notificationFrequency: BigInt(1),
        notificationTypes: ["price_alert", "daily_summary", "market_update"],
      },
    };

    saveProfile.mutate(profile);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-green-900 dark:text-green-100">
            {t.welcomeSetup}
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            {t.setupDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-green-900 dark:text-green-100 font-medium"
              >
                {t.yourName}
              </Label>
              <Input
                id="name"
                type="text"
                placeholder={t.enterYourName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-green-300 dark:border-green-800 focus:border-green-500 dark:focus:border-green-600 bg-white dark:bg-neutral-950"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                {t.notificationPreferences}
              </h3>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="push"
                  className="text-green-900 dark:text-green-100"
                >
                  {t.pushNotifications}
                </Label>
                <Switch
                  id="push"
                  checked={pushEnabled}
                  onCheckedChange={setPushEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="sms"
                  className="text-green-900 dark:text-green-100"
                >
                  {t.smsNotifications}
                </Label>
                <Switch
                  id="sms"
                  checked={smsEnabled}
                  onCheckedChange={setSmsEnabled}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={!name.trim() || saveProfile.isPending}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {saveProfile.isPending ? t.saving : t.saveProfile}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
