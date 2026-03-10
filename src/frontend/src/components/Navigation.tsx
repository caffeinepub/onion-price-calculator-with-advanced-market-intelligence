import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useLanguage } from "@/hooks/useLanguage";
import { useCheckAdmin } from "@/hooks/useQueries";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, BellRing, Calculator, Shield } from "lucide-react";

export function Navigation() {
  const { t } = useLanguage();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isAdmin } = useCheckAdmin();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const tabs = [
    { path: "/", label: t.calculator, icon: Calculator },
    { path: "/alerts", label: t.alerts, icon: Bell, requiresAuth: true },
    {
      path: "/notifications",
      label: t.notifications,
      icon: BellRing,
      requiresAuth: true,
    },
    {
      path: "/admin",
      label: t.adminDashboard,
      icon: Shield,
      requiresAuth: true,
      requiresAdmin: true,
    },
  ];

  const visibleTabs = tabs.filter((tab) => {
    if (tab.requiresAdmin && !isAdmin) return false;
    if (tab.requiresAuth && !isAuthenticated) return false;
    return true;
  });

  return (
    <nav className="mb-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPath === tab.path;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-white/80 dark:bg-neutral-900/80 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950 border border-green-200 dark:border-green-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
