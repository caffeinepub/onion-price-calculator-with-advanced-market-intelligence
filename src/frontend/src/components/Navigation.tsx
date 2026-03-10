import { useLanguage } from "@/hooks/useLanguage";
import { Link, useRouterState } from "@tanstack/react-router";
import { Calculator } from "lucide-react";

export function Navigation() {
  const { t } = useLanguage();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const tabs = [{ path: "/", label: t.calculator, icon: Calculator }];

  return (
    <nav className="mb-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map((tab) => {
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
