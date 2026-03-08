import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { MainLayout } from "./components/MainLayout";
import { LanguageProvider } from "./hooks/useLanguage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Alerts } from "./pages/Alerts";
import { Calculator } from "./pages/Calculator";
import { Notifications } from "./pages/Notifications";
import { TamilNaduPrices } from "./pages/TamilNaduPrices";
import { Trends } from "./pages/Trends";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const rootRoute = createRootRoute({
  component: MainLayout,
});

const calculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Calculator,
});

const trendsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/trends",
  component: Trends,
});

const alertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alerts",
  component: Alerts,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: Notifications,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
});

const tamilNaduPricesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tn-prices",
  component: TamilNaduPrices,
});

const routeTree = rootRoute.addChildren([
  calculatorRoute,
  trendsRoute,
  alertsRoute,
  notificationsRoute,
  adminRoute,
  tamilNaduPricesRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LanguageProvider>
          <RouterProvider router={router} />
          <Toaster />
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
