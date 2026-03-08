import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PriceRecord {
    id: bigint;
    source: string;
    date: Time;
    validated: boolean;
    pricePerKg: bigint;
    marketId: bigint;
    cropType: CropType;
}
export interface NotificationPreference {
    notificationTypes: Array<string>;
    smsEnabled: boolean;
    notificationFrequency: bigint;
    pushEnabled: boolean;
}
export interface TrendsData {
    monthlyTrends: Array<MarketSummary>;
    weeklyTrends: Array<MarketSummary>;
    dailyTrends: Array<MarketSummary>;
}
export type Time = bigint;
export interface AlertCondition {
    active: boolean;
    above: boolean;
    targetPrice: bigint;
    marketId: bigint;
    cropType: CropType;
    isPersistent: boolean;
}
export interface Notification {
    id: bigint;
    notificationType: string;
    userPrincipal: Principal;
    message: string;
    timestamp: Time;
    delivered: boolean;
}
export interface MarketSummary {
    averagePrice: bigint;
    maxPrice: bigint;
    priceTrend: Array<bigint>;
    minPrice: bigint;
    totalRecords: bigint;
}
export interface LivePriceRecord {
    region: string;
    pricePerKg: bigint;
    state: string;
    timestamp: Time;
    cropType: CropType;
    market: string;
}
export interface Market {
    id: bigint;
    region: string;
    name: string;
    location: string;
}
export interface UserProfile {
    notificationPreferences: NotificationPreference;
    name: string;
}
export interface TransactionRecord {
    pricePerKg: number;
    mobileNumber: string;
    weightKg: number;
    totalAmount: number;
    timestamp: bigint;
    laborName: string;
    farmerName: string;
}
export enum CropType {
    onion = "onion",
    groundnut = "groundnut"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMarket(name: string, location: string, region: string): Promise<bigint>;
    addPriceRecord(marketId: bigint, cropType: CropType, pricePerKg: bigint, source: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkAdmin(): Promise<boolean>;
    createAlert(marketId: bigint, cropType: CropType, targetPrice: bigint, above: boolean): Promise<void>;
    deleteAlert(marketId: bigint, cropType: CropType, targetPrice: bigint, above: boolean): Promise<void>;
    deleteMarket(marketId: bigint): Promise<void>;
    getActiveAlerts(): Promise<Array<AlertCondition>>;
    getAllNotifications(): Promise<Array<Notification>>;
    getAllPrices(): Promise<Array<PriceRecord>>;
    getAllUserAlerts(): Promise<Array<[Principal, Array<AlertCondition>]>>;
    getAllUserProfiles(): Promise<Array<[Principal, UserProfile]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInactiveAlerts(): Promise<Array<AlertCondition>>;
    getMarketPrices(marketId: bigint, cropType: CropType): Promise<Array<PriceRecord>>;
    getMarkets(): Promise<Array<Market>>;
    getTNPrices(cropType: CropType): Promise<Array<LivePriceRecord>>;
    getTransactions(): Promise<Array<TransactionRecord>>;
    getTrendsData(): Promise<TrendsData>;
    getUserAlerts(): Promise<Array<AlertCondition>>;
    getUserNotifications(): Promise<Array<Notification>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markNotificationDelivered(notificationId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveTransaction(farmerName: string, laborName: string, weightKg: number, pricePerKg: number, totalAmount: number, mobileNumber: string, timestamp: bigint): Promise<void>;
    sendNotification(userPrincipal: Principal, message: string, notificationType: string): Promise<void>;
    toggleAlert(marketId: bigint, cropType: CropType, targetPrice: bigint, above: boolean): Promise<void>;
    updateMarket(marketId: bigint, name: string, location: string, region: string): Promise<void>;
    updateTNPriceCache(cropType: CropType, prices: Array<LivePriceRecord>): Promise<void>;
    validatePriceRecord(recordId: bigint): Promise<void>;
}
