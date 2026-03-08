import type {
  AlertCondition,
  CropType,
  Market,
  Notification,
  PriceRecord,
  TransactionRecord,
  TrendsData,
  UserProfile,
} from "@/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// Admin Check
export function useCheckAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.checkAdmin();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

// Market Queries
export function useGetMarkets() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Market[]>({
    queryKey: ["markets"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMarkets();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useAddMarket() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      location,
      region,
    }: { name: string; location: string; region: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addMarket(name, location, region);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["markets"] });
    },
  });
}

export function useUpdateMarket() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      marketId,
      name,
      location,
      region,
    }: {
      marketId: bigint;
      name: string;
      location: string;
      region: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateMarket(marketId, name, location, region);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["markets"] });
    },
  });
}

export function useDeleteMarket() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (marketId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteMarket(marketId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["markets"] });
    },
  });
}

// Price Queries
export function useGetMarketPrices(marketId: bigint, cropType: CropType) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<PriceRecord[]>({
    queryKey: ["marketPrices", marketId.toString(), cropType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMarketPrices(marketId, cropType);
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useGetAllPrices() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<PriceRecord[]>({
    queryKey: ["allPrices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPrices();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useAddPriceRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      marketId,
      cropType,
      pricePerKg,
      source,
    }: {
      marketId: bigint;
      cropType: CropType;
      pricePerKg: bigint;
      source: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addPriceRecord(marketId, cropType, pricePerKg, source);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPrices"] });
      queryClient.invalidateQueries({ queryKey: ["marketPrices"] });
      queryClient.invalidateQueries({ queryKey: ["trendsData"] });
    },
  });
}

export function useValidatePriceRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recordId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.validatePriceRecord(recordId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPrices"] });
      queryClient.invalidateQueries({ queryKey: ["marketPrices"] });
    },
  });
}

// Trends Queries
export function useGetTrendsData() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<TrendsData>({
    queryKey: ["trendsData"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getTrendsData();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

// Alert Queries
export function useGetUserAlerts() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<AlertCondition[]>({
    queryKey: ["userAlerts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserAlerts();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useGetActiveAlerts() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<AlertCondition[]>({
    queryKey: ["activeAlerts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveAlerts();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useCreateAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      marketId,
      cropType,
      targetPrice,
      above,
    }: {
      marketId: bigint;
      cropType: CropType;
      targetPrice: bigint;
      above: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createAlert(marketId, cropType, targetPrice, above);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAlerts"] });
      queryClient.invalidateQueries({ queryKey: ["activeAlerts"] });
    },
  });
}

export function useToggleAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      marketId,
      cropType,
      targetPrice,
      above,
    }: {
      marketId: bigint;
      cropType: CropType;
      targetPrice: bigint;
      above: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.toggleAlert(marketId, cropType, targetPrice, above);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAlerts"] });
      queryClient.invalidateQueries({ queryKey: ["activeAlerts"] });
    },
  });
}

export function useDeleteAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      marketId,
      cropType,
      targetPrice,
      above,
    }: {
      marketId: bigint;
      cropType: CropType;
      targetPrice: bigint;
      above: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteAlert(marketId, cropType, targetPrice, above);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAlerts"] });
      queryClient.invalidateQueries({ queryKey: ["activeAlerts"] });
    },
  });
}

// Admin Alert Queries
export function useGetAllUserAlerts() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<
    Array<[import("@dfinity/principal").Principal, AlertCondition[]]>
  >({
    queryKey: ["allUserAlerts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserAlerts();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

// Notification Queries
export function useGetUserNotifications() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Notification[]>({
    queryKey: ["userNotifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserNotifications();
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: 30000, // Refetch every 30 seconds for new notifications
  });
}

export function useGetAllNotifications() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Notification[]>({
    queryKey: ["allNotifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNotifications();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useSendNotification() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userPrincipal,
      message,
      notificationType,
    }: {
      userPrincipal: import("@dfinity/principal").Principal;
      message: string;
      notificationType: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.sendNotification(userPrincipal, message, notificationType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
    },
  });
}

export function useMarkNotificationDelivered() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.markNotificationDelivered(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
    },
  });
}

// Admin User Profile Queries
export function useGetAllUserProfiles() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Array<[import("@dfinity/principal").Principal, UserProfile]>>(
    {
      queryKey: ["allUserProfiles"],
      queryFn: async () => {
        if (!actor) return [];
        return actor.getAllUserProfiles();
      },
      enabled: !!actor && !actorFetching && !!identity,
    },
  );
}

// Transaction Queries
export function useSaveTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      farmerName,
      laborName,
      weightKg,
      pricePerKg,
      totalAmount,
      mobileNumber,
      timestamp,
    }: {
      farmerName: string;
      laborName: string;
      weightKg: number;
      pricePerKg: number;
      totalAmount: number;
      mobileNumber: string;
      timestamp: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveTransaction(
        farmerName,
        laborName,
        weightKg,
        pricePerKg,
        totalAmount,
        mobileNumber,
        timestamp,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useGetTransactions() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<TransactionRecord[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactions();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}
