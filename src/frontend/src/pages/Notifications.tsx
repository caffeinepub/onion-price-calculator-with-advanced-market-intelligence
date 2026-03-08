import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useLanguage } from "@/hooks/useLanguage";
import { useGetUserNotifications } from "@/hooks/useQueries";
import { AlertCircle, BellRing, CheckCircle2, Clock } from "lucide-react";

export function Notifications() {
  const { t } = useLanguage();
  const { identity } = useInternetIdentity();
  const { data: notifications, isLoading } = useGetUserNotifications();

  if (!identity) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-6">
            <BellRing className="w-16 h-16 mx-auto mb-4 text-green-300 dark:text-green-700" />
            <p className="text-green-700 dark:text-green-300 text-lg">
              {t.loginToViewNotifications}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "alert":
      case "price_alert":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case "summary":
      case "daily_summary":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "announcement":
        return <BellRing className="w-5 h-5 text-purple-500" />;
      default:
        return <BellRing className="w-5 h-5 text-green-500" />;
    }
  };

  const getNotificationBadgeVariant = (
    type: string,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (type.toLowerCase()) {
      case "alert":
      case "price_alert":
        return "destructive";
      case "summary":
      case "daily_summary":
        return "default";
      case "announcement":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 mb-4 shadow-lg">
          <BellRing className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-green-900 dark:text-green-100 mb-3">
          {t.notificationCenter}
        </h1>
        <p className="text-lg text-green-700 dark:text-green-300">
          {t.viewYourNotifications}
        </p>
      </div>

      <Card className="border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-green-900 dark:text-green-100 flex items-center justify-between">
            <span>{t.recentNotifications}</span>
            {notifications && notifications.length > 0 && (
              <Badge variant="secondary" className="text-sm">
                {notifications.length}{" "}
                {notifications.length === 1 ? t.notification : t.notifications}
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            {t.allYourNotifications}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <BellRing className="w-12 h-12 mx-auto mb-3 text-green-400 animate-pulse" />
              <p className="text-green-700 dark:text-green-300">
                {t.loadingNotifications}
              </p>
            </div>
          ) : notifications && notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id.toString()}
                  className="p-4 border-2 border-green-200 dark:border-green-800 rounded-lg bg-white dark:bg-neutral-950 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification.notificationType)}
                      <Badge
                        variant={getNotificationBadgeVariant(
                          notification.notificationType,
                        )}
                      >
                        {notification.notificationType}
                      </Badge>
                    </div>
                    {notification.delivered && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs">{t.delivered}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-green-900 dark:text-green-100 mb-3 leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(
                        Number(notification.timestamp) / 1000000,
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BellRing className="w-16 h-16 mx-auto mb-4 text-green-300 dark:text-green-700" />
              <p className="text-green-700 dark:text-green-300 text-lg">
                {t.noNotificationsYet}
              </p>
              <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                {t.notificationsWillAppear}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
