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
import { Calculator } from "./pages/Calculator";
import { TamilNaduPrices } from "./pages/TamilNaduPrices";

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

const tamilNaduPricesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tn-prices",
  component: TamilNaduPrices,
});

const routeTree = rootRoute.addChildren([
  calculatorRoute,
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
