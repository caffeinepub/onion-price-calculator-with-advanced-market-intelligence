import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useLanguage } from "@/hooks/useLanguage";
import { useGetCallerUserProfile } from "@/hooks/useQueries";
import { Outlet } from "@tanstack/react-router";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { LanguageSelector } from "./LanguageSelector";
import { LoginButton } from "./LoginButton";
import { Navigation } from "./Navigation";
import { ProfileSetup } from "./ProfileSetup";
import { TamilNaduPricesButton } from "./TamilNaduPricesButton";

export function MainLayout() {
  const { t } = useLanguage();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-green-200 dark:border-green-800">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center mb-2">
            <LanguageSelector />
            <LoginButton />
          </div>
        </div>
      </div>

      <Header />

      <div className="container mx-auto px-4 py-2">
        <div className="text-center mb-4">
          <p className="text-sm md:text-base font-semibold text-green-700 dark:text-green-300">
            {t.createdBy}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mb-6">
        <TamilNaduPricesButton />
      </div>

      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <Footer />

      {showProfileSetup && <ProfileSetup />}
    </div>
  );
}
