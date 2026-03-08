import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Language = "en" | "ta" | "hi";

interface Translations {
  createdBy: string;
  onionCalculator: string;
  fastAndEasy: string;
  calculatorTitle: string;
  calculatorSubtitle: string;
  dateTimeFormat: {
    locale: string;
    weekday: "long" | "short" | "narrow";
    year: "numeric" | "2-digit";
    month: "long" | "short" | "narrow" | "numeric" | "2-digit";
    day: "numeric" | "2-digit";
  };
  timeFormat: {
    locale: string;
    hour: "2-digit" | "numeric";
    minute: "2-digit" | "numeric";
    second: "2-digit" | "numeric";
  };
  selectCrop: string;
  onion: string;
  groundnut: string;
  transactionDetails: string;
  enterTransactionInfo: string;
  farmerName: string;
  enterFarmerName: string;
  laborName: string;
  enterLaborName: string;
  totalOnionWeight: string;
  totalDrumsGroundnut: string;
  pricePerKg: string;
  pricePerDrum: string;
  totalAmount: string;
  perKg: string;
  perDrum: string;
  drums: string;
  saveToSpreadsheet: string;
  downloadSpreadsheet: string;
  entriesSaved: string;
  entry: string;
  entries: string;
  mobileNumber: string;
  enterMobileNumber: string;
  mobileNumberRequired: string;
  shareViaWhatsApp: string;
  shareViaSMS: string;
  fillAllFields: string;
  enterMobileToShare: string;
  shareMessage: {
    title: string;
    date: string;
    time: string;
    cropType: string;
    farmer: string;
    labor: string;
    quantity: string;
    price: string;
    total: string;
    notSpecified: string;
  };
  builtWith: string;
  using: string;
  selectLanguage: string;
  english: string;
  tamil: string;
  hindi: string;
  calculator: string;
  trends: string;
  alerts: string;
  notifications: string;
  adminDashboard: string;
  login: string;
  logout: string;
  loggingIn: string;
  welcomeSetup: string;
  setupDescription: string;
  yourName: string;
  enterYourName: string;
  notificationPreferences: string;
  pushNotifications: string;
  smsNotifications: string;
  saveProfile: string;
  saving: string;
  loginToViewTrends: string;
  priceAnalysis: string;
  historicalPriceTrends: string;
  selectMarket: string;
  allMarkets: string;
  timeframe: string;
  daily: string;
  weekly: string;
  monthly: string;
  averagePrice: string;
  minimumPrice: string;
  maximumPrice: string;
  priceTrends: string;
  viewHistoricalData: string;
  loadingData: string;
  noDataAvailable: string;
  average: string;
  minimum: string;
  maximum: string;
  loginToManageAlerts: string;
  priceAlerts: string;
  manageYourAlerts: string;
  createNewAlert: string;
  setUpPriceAlert: string;
  chooseMarket: string;
  targetPrice: string;
  alertWhenPriceGoesAbove: string;
  alertWhenPriceGoesBelow: string;
  createAlert: string;
  creating: string;
  yourAlerts: string;
  manageExistingAlerts: string;
  loadingAlerts: string;
  unknownMarket: string;
  alertAbove: string;
  alertBelow: string;
  active: string;
  inactive: string;
  noAlertsYet: string;
  alertCreated: string;
  alertCreationFailed: string;
  loginToViewNotifications: string;
  notificationCenter: string;
  viewYourNotifications: string;
  recentNotifications: string;
  allYourNotifications: string;
  loadingNotifications: string;
  noNotificationsYet: string;
  loginToAccessAdmin: string;
  checkingPermissions: string;
  accessDenied: string;
  adminAccessRequired: string;
  manageSystemData: string;
  addNewMarket: string;
  createMarketEntry: string;
  marketName: string;
  enterMarketName: string;
  location: string;
  enterLocation: string;
  region: string;
  enterRegion: string;
  addMarket: string;
  adding: string;
  addPriceRecord: string;
  recordNewPrice: string;
  dataSource: string;
  enterDataSource: string;
  addPrice: string;
  systemOverview: string;
  currentSystemStats: string;
  totalMarkets: string;
  totalPriceRecords: string;
  systemStatus: string;
  operational: string;
  marketAdded: string;
  marketAddFailed: string;
  priceRecordAdded: string;
  priceRecordAddFailed: string;
  priceTrend: string;
  dataPoints: string;
  addPriceDataToSee: string;
  recentPriceRecords: string;
  duplicateAlert: string;
  alertDeactivated: string;
  alertActivated: string;
  alertToggleFailed: string;
  alertDeleted: string;
  alertDeleteFailed: string;
  createFirstAlert: string;
  delivered: string;
  notification: string;
  notificationsWillAppear: string;
  totalUsers: string;
  activeAlerts: string;
  markets: string;
  prices: string;
  system: string;
  notificationDelivery: string;
  allSystemsRunning: string;
  recentActivity: string;
  registeredUsers: string;
  activeAlertsMonitoring: string;
  priceRecordsStored: string;
  marketsConfigured: string;
  tamilNaduPrices: string;
  tamilNaduPricesDescription: string;
  highestPrice: string;
  searchMarket: string;
  searchTNMarkets: string;
  searchPlaceholder: string;
  topTNMarketsByPrice: string;
  topMarketsDescription: string;
  priceByMarket: string;
  showingResults: string;
  market: string;
  cropType: string;
  lastUpdated: string;
  noResultsFound: string;
  crops: {
    Onion: string;
    Groundnut: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    createdBy: "Created by Vichuu and Powered by Caffeine",
    onionCalculator: "Onion Calculator",
    fastAndEasy: "Fast and easy pricing",
    calculatorTitle: "Onion Price Calculator",
    calculatorSubtitle:
      "Calculate onion transaction totals and share details instantly",
    dateTimeFormat: {
      locale: "en-US",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    timeFormat: {
      locale: "en-US",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
    selectCrop: "Select Crop",
    onion: "Onion",
    groundnut: "Groundnut",
    transactionDetails: "Transaction Details",
    enterTransactionInfo: "Enter transaction information below",
    farmerName: "Farmer Name",
    enterFarmerName: "Enter farmer name",
    laborName: "Labor Name",
    enterLaborName: "Enter labor name",
    totalOnionWeight: "Total Onion Weight (kg)",
    totalDrumsGroundnut: "Total Drums of Groundnut",
    pricePerKg: "Price per kg (₹)",
    pricePerDrum: "Price per Drum (₹)",
    totalAmount: "Total Amount",
    perKg: "per kg",
    perDrum: "per drum",
    drums: "drums",
    saveToSpreadsheet: "Save to Spreadsheet",
    downloadSpreadsheet: "Download Spreadsheet",
    entriesSaved: "saved in spreadsheet",
    entry: "entry",
    entries: "entries",
    mobileNumber: "Mobile Number",
    enterMobileNumber: "Enter mobile number",
    mobileNumberRequired: "Mobile number required for sharing",
    shareViaWhatsApp: "Share via WhatsApp",
    shareViaSMS: "Share via SMS",
    fillAllFields: "Fill all fields to enable sharing",
    enterMobileToShare: "Enter mobile number to enable sharing",
    shareMessage: {
      title: "🌾 Agricultural Transaction Details",
      date: "📅 Date",
      time: "🕐 Time",
      cropType: "🌱 Crop Type",
      farmer: "👨‍🌾 Farmer Name",
      labor: "👷 Labor Name",
      quantity: "⚖️ Quantity",
      price: "💰 Price",
      total: "💵 Total Amount",
      notSpecified: "Not specified",
    },
    builtWith: "Built with",
    using: "using",
    selectLanguage: "Select Language",
    english: "English",
    tamil: "Tamil",
    hindi: "Hindi",
    calculator: "Calculator",
    trends: "Trends",
    alerts: "Alerts",
    notifications: "Notifications",
    adminDashboard: "Admin",
    login: "Login",
    logout: "Logout",
    loggingIn: "Logging in...",
    welcomeSetup: "Welcome! Set Up Your Profile",
    setupDescription: "Please provide your details to get started",
    yourName: "Your Name",
    enterYourName: "Enter your name",
    notificationPreferences: "Notification Preferences",
    pushNotifications: "Push Notifications",
    smsNotifications: "SMS Notifications",
    saveProfile: "Save Profile",
    saving: "Saving...",
    loginToViewTrends: "Please login to view price trends",
    priceAnalysis: "Price Analysis",
    historicalPriceTrends: "Historical price trends and market insights",
    selectMarket: "Select Market",
    allMarkets: "All Markets",
    timeframe: "Timeframe",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    averagePrice: "Average Price",
    minimumPrice: "Minimum Price",
    maximumPrice: "Maximum Price",
    priceTrends: "Price Trends",
    viewHistoricalData: "View historical price data and trends",
    loadingData: "Loading data...",
    noDataAvailable: "No data available",
    average: "Average",
    minimum: "Minimum",
    maximum: "Maximum",
    loginToManageAlerts: "Please login to manage price alerts",
    priceAlerts: "Price Alerts",
    manageYourAlerts: "Set up and manage your price alerts",
    createNewAlert: "Create New Alert",
    setUpPriceAlert: "Set up a new price alert",
    chooseMarket: "Choose a market",
    targetPrice: "Target Price (₹)",
    alertWhenPriceGoesAbove: "Alert when price goes above target",
    alertWhenPriceGoesBelow: "Alert when price goes below target",
    createAlert: "Create Alert",
    creating: "Creating...",
    yourAlerts: "Your Alerts",
    manageExistingAlerts: "Manage your existing alerts",
    loadingAlerts: "Loading alerts...",
    unknownMarket: "Unknown Market",
    alertAbove: "Alert above",
    alertBelow: "Alert below",
    active: "Active",
    inactive: "Inactive",
    noAlertsYet: "No alerts created yet",
    alertCreated: "Alert created successfully",
    alertCreationFailed: "Failed to create alert",
    loginToViewNotifications: "Please login to view notifications",
    notificationCenter: "Notification Center",
    viewYourNotifications: "View all your notifications",
    recentNotifications: "Recent Notifications",
    allYourNotifications: "All your notifications in one place",
    loadingNotifications: "Loading notifications...",
    noNotificationsYet: "No notifications yet",
    loginToAccessAdmin: "Please login to access admin dashboard",
    checkingPermissions: "Checking permissions...",
    accessDenied: "Access Denied",
    adminAccessRequired: "Admin access is required to view this page",
    manageSystemData: "Manage markets, prices, and system data",
    addNewMarket: "Add New Market",
    createMarketEntry: "Create a new market entry",
    marketName: "Market Name",
    enterMarketName: "Enter market name",
    location: "Location",
    enterLocation: "Enter location",
    region: "Region",
    enterRegion: "Enter region",
    addMarket: "Add Market",
    adding: "Adding...",
    addPriceRecord: "Add Price Record",
    recordNewPrice: "Record a new price entry",
    dataSource: "Data Source",
    enterDataSource: "Enter data source",
    addPrice: "Add Price",
    systemOverview: "System Overview",
    currentSystemStats: "Current system statistics",
    totalMarkets: "Total Markets",
    totalPriceRecords: "Total Price Records",
    systemStatus: "System Status",
    operational: "Operational",
    marketAdded: "Market added successfully",
    marketAddFailed: "Failed to add market",
    priceRecordAdded: "Price record added successfully",
    priceRecordAddFailed: "Failed to add price record",
    priceTrend: "Price Trend",
    dataPoints: "data points",
    addPriceDataToSee: "Add price data to see trends",
    recentPriceRecords: "Recent Price Records",
    duplicateAlert: "Duplicate alert already exists",
    alertDeactivated: "Alert deactivated",
    alertActivated: "Alert activated",
    alertToggleFailed: "Failed to toggle alert",
    alertDeleted: "Alert deleted successfully",
    alertDeleteFailed: "Failed to delete alert",
    createFirstAlert: "Create your first alert to get started",
    delivered: "Delivered",
    notification: "notification",
    notificationsWillAppear:
      "Notifications will appear here when you receive them",
    totalUsers: "Total Users",
    activeAlerts: "Active Alerts",
    markets: "Markets",
    prices: "Prices",
    system: "System",
    notificationDelivery: "Notification Delivery",
    allSystemsRunning: "All systems running smoothly",
    recentActivity: "Recent Activity",
    registeredUsers: "registered users",
    activeAlertsMonitoring: "active alerts monitoring",
    priceRecordsStored: "price records stored",
    marketsConfigured: "markets configured",
    tamilNaduPrices: "Tamil Nadu Prices",
    tamilNaduPricesDescription:
      "Current daily prices for Onion and Groundnut in Tamil Nadu markets",
    highestPrice: "Highest Price",
    searchMarket: "Search Market",
    searchTNMarkets: "Search Tamil Nadu markets",
    searchPlaceholder: "Search by market name...",
    topTNMarketsByPrice: "Top Tamil Nadu Markets by Price",
    topMarketsDescription: "Highest priced markets in Tamil Nadu",
    priceByMarket: "Price by Market",
    showingResults: "Showing {count} results",
    market: "Market",
    cropType: "Crop Type",
    lastUpdated: "Last Updated",
    noResultsFound: "No results found",
    crops: {
      Onion: "Onion",
      Groundnut: "Groundnut",
    },
  },
  ta: {
    createdBy: "விச்சு உருவாக்கியது மற்றும் காஃபைன் மூலம் இயக்கப்படுகிறது",
    onionCalculator: "வெங்காய கணக்கீட்டாளர்",
    fastAndEasy: "விரைவான மற்றும் எளிதான விலை நிர்ணயம்",
    calculatorTitle: "வெங்காய விலை கணக்கீட்டாளர்",
    calculatorSubtitle:
      "வெங்காய பரிவர்த்தனை மொத்தங்களை கணக்கிட்டு விவரங்களை உடனடியாக பகிரவும்",
    dateTimeFormat: {
      locale: "ta-IN",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    timeFormat: {
      locale: "ta-IN",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
    selectCrop: "பயிரைத் தேர்ந்தெடுக்கவும்",
    onion: "வெங்காயம்",
    groundnut: "நிலக்கடலை",
    transactionDetails: "பரிவர்த்தனை விவரங்கள்",
    enterTransactionInfo: "கீழே பரிவர்த்தனை தகவலை உள்ளிடவும்",
    farmerName: "விவசாயி பெயர்",
    enterFarmerName: "விவசாயி பெயரை உள்ளிடவும்",
    laborName: "தொழிலாளர் பெயர்",
    enterLaborName: "தொழிலாளர் பெயரை உள்ளிடவும்",
    totalOnionWeight: "மொத்த வெங்காய எடை (கிலோ)",
    totalDrumsGroundnut: "மொத்த நிலக்கடலை டிரம்கள்",
    pricePerKg: "ஒரு கிலோவுக்கு விலை (₹)",
    pricePerDrum: "ஒரு டிரம்மிற்கு விலை (₹)",
    totalAmount: "மொத்த தொகை",
    perKg: "ஒரு கிலோவுக்கு",
    perDrum: "ஒரு டிரம்மிற்கு",
    drums: "டிரம்கள்",
    saveToSpreadsheet: "விரிதாளில் சேமிக்கவும்",
    downloadSpreadsheet: "விரிதாளை பதிவிறக்கவும்",
    entriesSaved: "விரிதாளில் சேமிக்கப்பட்டது",
    entry: "உள்ளீடு",
    entries: "உள்ளீடுகள்",
    mobileNumber: "மொபைல் எண்",
    enterMobileNumber: "மொபைல் எண்ணை உள்ளிடவும்",
    mobileNumberRequired: "பகிர்வதற்கு மொபைல் எண் தேவை",
    shareViaWhatsApp: "வாட்ஸ்அப் வழியாக பகிரவும்",
    shareViaSMS: "எஸ்எம்எஸ் வழியாக பகிரவும்",
    fillAllFields: "பகிர்வை இயக்க அனைத்து புலங்களையும் நிரப்பவும்",
    enterMobileToShare: "பகிர்வை இயக்க மொபைல் எண்ணை உள்ளிடவும்",
    shareMessage: {
      title: "🌾 விவசாய பரிவர்த்தனை விவரங்கள்",
      date: "📅 தேதி",
      time: "🕐 நேரம்",
      cropType: "🌱 பயிர் வகை",
      farmer: "👨‍🌾 விவசாயி பெயர்",
      labor: "👷 தொழிலாளர் பெயர்",
      quantity: "⚖️ அளவு",
      price: "💰 விலை",
      total: "💵 மொத்த தொகை",
      notSpecified: "குறிப்பிடப்படவில்லை",
    },
    builtWith: "அன்புடன் உருவாக்கப்பட்டது",
    using: "பயன்படுத்தி",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    english: "ஆங்கிலம்",
    tamil: "தமிழ்",
    hindi: "இந்தி",
    calculator: "கணக்கீட்டாளர்",
    trends: "போக்குகள்",
    alerts: "எச்சரிக்கைகள்",
    notifications: "அறிவிப்புகள்",
    adminDashboard: "நிர்வாகம்",
    login: "உள்நுழைய",
    logout: "வெளியேறு",
    loggingIn: "உள்நுழைகிறது...",
    welcomeSetup: "வரவேற்கிறோம்! உங்கள் சுயவிவரத்தை அமைக்கவும்",
    setupDescription: "தொடங்க உங்கள் விவரங்களை வழங்கவும்",
    yourName: "உங்கள் பெயர்",
    enterYourName: "உங்கள் பெயரை உள்ளிடவும்",
    notificationPreferences: "அறிவிப்பு விருப்பத்தேர்வுகள்",
    pushNotifications: "புஷ் அறிவிப்புகள்",
    smsNotifications: "எஸ்எம்எஸ் அறிவிப்புகள்",
    saveProfile: "சுயவிவரத்தை சேமிக்கவும்",
    saving: "சேமிக்கிறது...",
    loginToViewTrends: "விலை போக்குகளைக் காண உள்நுழைக",
    priceAnalysis: "விலை பகுப்பாய்வு",
    historicalPriceTrends: "வரலாற்று விலை போக்குகள் மற்றும் சந்தை நுண்ணறிவுகள்",
    selectMarket: "சந்தையைத் தேர்ந்தெடுக்கவும்",
    allMarkets: "அனைத்து சந்தைகள்",
    timeframe: "காலக்கட்டம்",
    daily: "தினசரி",
    weekly: "வாராந்திர",
    monthly: "மாதாந்திர",
    averagePrice: "சராசரி விலை",
    minimumPrice: "குறைந்தபட்ச விலை",
    maximumPrice: "அதிகபட்ச விலை",
    priceTrends: "விலை போக்குகள்",
    viewHistoricalData: "வரலாற்று விலை தரவு மற்றும் போக்குகளைக் காண்க",
    loadingData: "தரவு ஏற்றுகிறது...",
    noDataAvailable: "தரவு இல்லை",
    average: "சராசரி",
    minimum: "குறைந்தபட்சம்",
    maximum: "அதிகபட்சம்",
    loginToManageAlerts: "விலை எச்சரிக்கைகளை நிர்வகிக்க உள்நுழைக",
    priceAlerts: "விலை எச்சரிக்கைகள்",
    manageYourAlerts: "உங்கள் விலை எச்சரிக்கைகளை அமைத்து நிர்வகிக்கவும்",
    createNewAlert: "புதிய எச்சரிக்கையை உருவாக்கவும்",
    setUpPriceAlert: "புதிய விலை எச்சரிக்கையை அமைக்கவும்",
    chooseMarket: "சந்தையைத் தேர்ந்தெடுக்கவும்",
    targetPrice: "இலக்கு விலை (₹)",
    alertWhenPriceGoesAbove: "விலை இலக்கை மீறும்போது எச்சரிக்கை",
    alertWhenPriceGoesBelow: "விலை இலக்கிற்குக் கீழே செல்லும்போது எச்சரிக்கை",
    createAlert: "எச்சரிக்கையை உருவாக்கவும்",
    creating: "உருவாக்குகிறது...",
    yourAlerts: "உங்கள் எச்சரிக்கைகள்",
    manageExistingAlerts: "உங்கள் தற்போதைய எச்சரிக்கைகளை நிர்வகிக்கவும்",
    loadingAlerts: "எச்சரிக்கைகள் ஏற்றுகிறது...",
    unknownMarket: "அறியப்படாத சந்தை",
    alertAbove: "மேலே எச்சரிக்கை",
    alertBelow: "கீழே எச்சரிக்கை",
    active: "செயலில்",
    inactive: "செயலற்றது",
    noAlertsYet: "இன்னும் எச்சரிக்கைகள் இல்லை",
    alertCreated: "எச்சரிக்கை வெற்றிகரமாக உருவாக்கப்பட்டது",
    alertCreationFailed: "எச்சரிக்கையை உருவாக்க முடியவில்லை",
    loginToViewNotifications: "அறிவிப்புகளைக் காண உள்நுழைக",
    notificationCenter: "அறிவிப்பு மையம்",
    viewYourNotifications: "உங்கள் அனைத்து அறிவிப்புகளையும் காண்க",
    recentNotifications: "சமீபத்திய அறிவிப்புகள்",
    allYourNotifications: "உங்கள் அனைத்து அறிவிப்புகளும் ஒரே இடத்தில்",
    loadingNotifications: "அறிவிப்புகள் ஏற்றுகிறது...",
    noNotificationsYet: "இன்னும் அறிவிப்புகள் இல்லை",
    loginToAccessAdmin: "நிர்வாக டாஷ்போர்டை அணுக உள்நுழைக",
    checkingPermissions: "அனுமதிகளைச் சரிபார்க்கிறது...",
    accessDenied: "அணுகல் மறுக்கப்பட்டது",
    adminAccessRequired: "இந்தப் பக்கத்தைக் காண நிர்வாக அணுகல் தேவை",
    manageSystemData: "சந்தைகள், விலைகள் மற்றும் கணினி தரவை நிர்வகிக்கவும்",
    addNewMarket: "புதிய சந்தையைச் சேர்க்கவும்",
    createMarketEntry: "புதிய சந்தை உள்ளீட்டை உருவாக்கவும்",
    marketName: "சந்தை பெயர்",
    enterMarketName: "சந்தை பெயரை உள்ளிடவும்",
    location: "இடம்",
    enterLocation: "இடத்தை உள்ளிடவும்",
    region: "பகுதி",
    enterRegion: "பகுதியை உள்ளிடவும்",
    addMarket: "சந்தையைச் சேர்க்கவும்",
    adding: "சேர்க்கிறது...",
    addPriceRecord: "விலை பதிவைச் சேர்க்கவும்",
    recordNewPrice: "புதிய விலை உள்ளீட்டைப் பதிவு செய்யவும்",
    dataSource: "தரவு மூலம்",
    enterDataSource: "தரவு மூலத்தை உள்ளிடவும்",
    addPrice: "விலையைச் சேர்க்கவும்",
    systemOverview: "கணினி மேலோட்டம்",
    currentSystemStats: "தற்போதைய கணினி புள்ளிவிவரங்கள்",
    totalMarkets: "மொத்த சந்தைகள்",
    totalPriceRecords: "மொத்த விலை பதிவுகள்",
    systemStatus: "கணினி நிலை",
    operational: "செயல்பாட்டில்",
    marketAdded: "சந்தை வெற்றிகரமாக சேர்க்கப்பட்டது",
    marketAddFailed: "சந்தையைச் சேர்க்க முடியவில்லை",
    priceRecordAdded: "விலை பதிவு வெற்றிகரமாக சேர்க்கப்பட்டது",
    priceRecordAddFailed: "விலை பதிவைச் சேர்க்க முடியவில்லை",
    priceTrend: "விலை போக்கு",
    dataPoints: "தரவு புள்ளிகள்",
    addPriceDataToSee: "போக்குகளைக் காண விலை தரவைச் சேர்க்கவும்",
    recentPriceRecords: "சமீபத்திய விலை பதிவுகள்",
    duplicateAlert: "நகல் எச்சரிக்கை ஏற்கனவே உள்ளது",
    alertDeactivated: "எச்சரிக்கை செயலிழக்கப்பட்டது",
    alertActivated: "எச்சரிக்கை செயல்படுத்தப்பட்டது",
    alertToggleFailed: "எச்சரிக்கையை மாற்ற முடியவில்லை",
    alertDeleted: "எச்சரிக்கை வெற்றிகரமாக நீக்கப்பட்டது",
    alertDeleteFailed: "எச்சரிக்கையை நீக்க முடியவில்லை",
    createFirstAlert: "தொடங்க உங்கள் முதல் எச்சரிக்கையை உருவாக்கவும்",
    delivered: "வழங்கப்பட்டது",
    notification: "அறிவிப்பு",
    notificationsWillAppear: "நீங்கள் பெறும்போது அறிவிப்புகள் இங்கே தோன்றும்",
    totalUsers: "மொத்த பயனர்கள்",
    activeAlerts: "செயலில் உள்ள எச்சரிக்கைகள்",
    markets: "சந்தைகள்",
    prices: "விலைகள்",
    system: "கணினி",
    notificationDelivery: "அறிவிப்பு வழங்கல்",
    allSystemsRunning: "அனைத்து அமைப்புகளும் சீராக இயங்குகின்றன",
    recentActivity: "சமீபத்திய செயல்பாடு",
    registeredUsers: "பதிவு செய்யப்பட்ட பயனர்கள்",
    activeAlertsMonitoring: "செயலில் உள்ள எச்சரிக்கைகள் கண்காணிப்பு",
    priceRecordsStored: "விலை பதிவுகள் சேமிக்கப்பட்டுள்ளன",
    marketsConfigured: "சந்தைகள் கட்டமைக்கப்பட்டுள்ளன",
    tamilNaduPrices: "தமிழ்நாடு விலைகள்",
    tamilNaduPricesDescription:
      "தமிழ்நாடு சந்தைகளில் வெங்காயம் மற்றும் நிலக்கடலைக்கான தற்போதைய தினசரி விலைகள்",
    highestPrice: "அதிக விலை",
    searchMarket: "சந்தையைத் தேடவும்",
    searchTNMarkets: "தமிழ்நாடு சந்தைகளைத் தேடவும்",
    searchPlaceholder: "சந்தை பெயரால் தேடவும்...",
    topTNMarketsByPrice: "விலையின்படி சிறந்த தமிழ்நாடு சந்தைகள்",
    topMarketsDescription: "தமிழ்நாட்டில் அதிக விலை சந்தைகள்",
    priceByMarket: "சந்தையின்படி விலை",
    showingResults: "{count} முடிவுகளைக் காட்டுகிறது",
    market: "சந்தை",
    cropType: "பயிர் வகை",
    lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது",
    noResultsFound: "முடிவுகள் இல்லை",
    crops: {
      Onion: "வெங்காயம்",
      Groundnut: "நிலக்கடலை",
    },
  },
  hi: {
    createdBy: "विच्चू द्वारा बनाया गया और कैफीन द्वारा संचालित",
    onionCalculator: "प्याज कैलकुलेटर",
    fastAndEasy: "तेज़ और आसान मूल्य निर्धारण",
    calculatorTitle: "प्याज मूल्य कैलकुलेटर",
    calculatorSubtitle: "प्याज लेनदेन की कुल राशि की गणना करें और विवरण तुरंत साझा करें",
    dateTimeFormat: {
      locale: "hi-IN",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    timeFormat: {
      locale: "hi-IN",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
    selectCrop: "फसल चुनें",
    onion: "प्याज",
    groundnut: "मूंगफली",
    transactionDetails: "लेनदेन विवरण",
    enterTransactionInfo: "नीचे लेनदेन की जानकारी दर्ज करें",
    farmerName: "किसान का नाम",
    enterFarmerName: "किसान का नाम दर्ज करें",
    laborName: "मजदूर का नाम",
    enterLaborName: "मजदूर का नाम दर्ज करें",
    totalOnionWeight: "कुल प्याज वजन (किलो)",
    totalDrumsGroundnut: "मूंगफली के कुल ड्रम",
    pricePerKg: "प्रति किलो मूल्य (₹)",
    pricePerDrum: "प्रति ड्रम मूल्य (₹)",
    totalAmount: "कुल राशि",
    perKg: "प्रति किलो",
    perDrum: "प्रति ड्रम",
    drums: "ड्रम",
    saveToSpreadsheet: "स्प्रेडशीट में सहेजें",
    downloadSpreadsheet: "स्प्रेडशीट डाउनलोड करें",
    entriesSaved: "स्प्रेडशीट में सहेजी गई",
    entry: "प्रविष्टि",
    entries: "प्रविष्टियाँ",
    mobileNumber: "मोबाइल नंबर",
    enterMobileNumber: "मोबाइल नंबर दर्ज करें",
    mobileNumberRequired: "साझा करने के लिए मोबाइल नंबर आवश्यक है",
    shareViaWhatsApp: "व्हाट्सएप के माध्यम से साझा करें",
    shareViaSMS: "एसएमएस के माध्यम से साझा करें",
    fillAllFields: "साझा करने को सक्षम करने के लिए सभी फ़ील्ड भरें",
    enterMobileToShare: "साझा करने को सक्षम करने के लिए मोबाइल नंबर दर्ज करें",
    shareMessage: {
      title: "🌾 कृषि लेनदेन विवरण",
      date: "📅 तारीख",
      time: "🕐 समय",
      cropType: "🌱 फसल का प्रकार",
      farmer: "👨‍🌾 किसान का नाम",
      labor: "👷 मजदूर का नाम",
      quantity: "⚖️ मात्रा",
      price: "💰 मूल्य",
      total: "💵 कुल राशि",
      notSpecified: "निर्दिष्ट नहीं",
    },
    builtWith: "प्यार से बनाया गया",
    using: "उपयोग करते हुए",
    selectLanguage: "भाषा चुनें",
    english: "अंग्रेज़ी",
    tamil: "तमिल",
    hindi: "हिंदी",
    calculator: "कैलकुलेटर",
    trends: "रुझान",
    alerts: "अलर्ट",
    notifications: "सूचनाएं",
    adminDashboard: "प्रशासन",
    login: "लॉगिन",
    logout: "लॉगआउट",
    loggingIn: "लॉगिन हो रहा है...",
    welcomeSetup: "स्वागत है! अपनी प्रोफ़ाइल सेट करें",
    setupDescription: "शुरू करने के लिए कृपया अपना विवरण प्रदान करें",
    yourName: "आपका नाम",
    enterYourName: "अपना नाम दर्ज करें",
    notificationPreferences: "सूचना प्राथमिकताएं",
    pushNotifications: "पुश सूचनाएं",
    smsNotifications: "एसएमएस सूचनाएं",
    saveProfile: "प्रोफ़ाइल सहेजें",
    saving: "सहेजा जा रहा है...",
    loginToViewTrends: "मूल्य रुझान देखने के लिए कृपया लॉगिन करें",
    priceAnalysis: "मूल्य विश्लेषण",
    historicalPriceTrends: "ऐतिहासिक मूल्य रुझान और बाजार अंतर्दृष्टि",
    selectMarket: "बाजार चुनें",
    allMarkets: "सभी बाजार",
    timeframe: "समय सीमा",
    daily: "दैनिक",
    weekly: "साप्ताहिक",
    monthly: "मासिक",
    averagePrice: "औसत मूल्य",
    minimumPrice: "न्यूनतम मूल्य",
    maximumPrice: "अधिकतम मूल्य",
    priceTrends: "मूल्य रुझान",
    viewHistoricalData: "ऐतिहासिक मूल्य डेटा और रुझान देखें",
    loadingData: "डेटा लोड हो रहा है...",
    noDataAvailable: "कोई डेटा उपलब्ध नहीं",
    average: "औसत",
    minimum: "न्यूनतम",
    maximum: "अधिकतम",
    loginToManageAlerts: "मूल्य अलर्ट प्रबंधित करने के लिए कृपया लॉगिन करें",
    priceAlerts: "मूल्य अलर्ट",
    manageYourAlerts: "अपने मूल्य अलर्ट सेट करें और प्रबंधित करें",
    createNewAlert: "नया अलर्ट बनाएं",
    setUpPriceAlert: "एक नया मूल्य अलर्ट सेट करें",
    chooseMarket: "एक बाजार चुनें",
    targetPrice: "लक्ष्य मूल्य (₹)",
    alertWhenPriceGoesAbove: "जब मूल्य लक्ष्य से ऊपर जाए तो अलर्ट करें",
    alertWhenPriceGoesBelow: "जब मूल्य लक्ष्य से नीचे जाए तो अलर्ट करें",
    createAlert: "अलर्ट बनाएं",
    creating: "बनाया जा रहा है...",
    yourAlerts: "आपके अलर्ट",
    manageExistingAlerts: "अपने मौजूदा अलर्ट प्रबंधित करें",
    loadingAlerts: "अलर्ट लोड हो रहे हैं...",
    unknownMarket: "अज्ञात बाजार",
    alertAbove: "ऊपर अलर्ट",
    alertBelow: "नीचे अलर्ट",
    active: "सक्रिय",
    inactive: "निष्क्रिय",
    noAlertsYet: "अभी तक कोई अलर्ट नहीं बनाया गया",
    alertCreated: "अलर्ट सफलतापूर्वक बनाया गया",
    alertCreationFailed: "अलर्ट बनाने में विफल",
    loginToViewNotifications: "सूचनाएं देखने के लिए कृपया लॉगिन करें",
    notificationCenter: "सूचना केंद्र",
    viewYourNotifications: "अपनी सभी सूचनाएं देखें",
    recentNotifications: "हाल की सूचनाएं",
    allYourNotifications: "आपकी सभी सूचनाएं एक स्थान पर",
    loadingNotifications: "सूचनाएं लोड हो रही हैं...",
    noNotificationsYet: "अभी तक कोई सूचना नहीं",
    loginToAccessAdmin: "एडमिन डैशबोर्ड एक्सेस करने के लिए कृपया लॉगिन करें",
    checkingPermissions: "अनुमतियां जांची जा रही हैं...",
    accessDenied: "पहुंच अस्वीकृत",
    adminAccessRequired: "इस पृष्ठ को देखने के लिए व्यवस्थापक पहुंच आवश्यक है",
    manageSystemData: "बाजारों, मूल्यों और सिस्टम डेटा को प्रबंधित करें",
    addNewMarket: "नया बाजार जोड़ें",
    createMarketEntry: "एक नई बाजार प्रविष्टि बनाएं",
    marketName: "बाजार का नाम",
    enterMarketName: "बाजार का नाम दर्ज करें",
    location: "स्थान",
    enterLocation: "स्थान दर्ज करें",
    region: "क्षेत्र",
    enterRegion: "क्षेत्र दर्ज करें",
    addMarket: "बाजार जोड़ें",
    adding: "जोड़ा जा रहा है...",
    addPriceRecord: "मूल्य रिकॉर्ड जोड़ें",
    recordNewPrice: "एक नई मूल्य प्रविष्टि रिकॉर्ड करें",
    dataSource: "डेटा स्रोत",
    enterDataSource: "डेटा स्रोत दर्ज करें",
    addPrice: "मूल्य जोड़ें",
    systemOverview: "सिस्टम अवलोकन",
    currentSystemStats: "वर्तमान सिस्टम आंकड़े",
    totalMarkets: "कुल बाजार",
    totalPriceRecords: "कुल मूल्य रिकॉर्ड",
    systemStatus: "सिस्टम स्थिति",
    operational: "परिचालन",
    marketAdded: "बाजार सफलतापूर्वक जोड़ा गया",
    marketAddFailed: "बाजार जोड़ने में विफल",
    priceRecordAdded: "मूल्य रिकॉर्ड सफलतापूर्वक जोड़ा गया",
    priceRecordAddFailed: "मूल्य रिकॉर्ड जोड़ने में विफल",
    priceTrend: "मूल्य रुझान",
    dataPoints: "डेटा बिंदु",
    addPriceDataToSee: "रुझान देखने के लिए मूल्य डेटा जोड़ें",
    recentPriceRecords: "हाल के मूल्य रिकॉर्ड",
    duplicateAlert: "डुप्लिकेट अलर्ट पहले से मौजूद है",
    alertDeactivated: "अलर्ट निष्क्रिय किया गया",
    alertActivated: "अलर्ट सक्रिय किया गया",
    alertToggleFailed: "अलर्ट टॉगल करने में विफल",
    alertDeleted: "अलर्ट सफलतापूर्वक हटाया गया",
    alertDeleteFailed: "अलर्ट हटाने में विफल",
    createFirstAlert: "शुरू करने के लिए अपना पहला अलर्ट बनाएं",
    delivered: "वितरित",
    notification: "सूचना",
    notificationsWillAppear: "जब आप प्राप्त करेंगे तो सूचनाएं यहां दिखाई देंगी",
    totalUsers: "कुल उपयोगकर्ता",
    activeAlerts: "सक्रिय अलर्ट",
    markets: "बाजार",
    prices: "मूल्य",
    system: "सिस्टम",
    notificationDelivery: "सूचना वितरण",
    allSystemsRunning: "सभी सिस्टम सुचारू रूप से चल रहे हैं",
    recentActivity: "हाल की गतिविधि",
    registeredUsers: "पंजीकृत उपयोगकर्ता",
    activeAlertsMonitoring: "सक्रिय अलर्ट निगरानी",
    priceRecordsStored: "मूल्य रिकॉर्ड संग्रहीत",
    marketsConfigured: "बाजार कॉन्फ़िगर किए गए",
    tamilNaduPrices: "तमिलनाडु मूल्य",
    tamilNaduPricesDescription:
      "तमिलनाडु बाजारों में प्याज और मूंगफली के लिए वर्तमान दैनिक मूल्य",
    highestPrice: "सबसे अधिक मूल्य",
    searchMarket: "बाजार खोजें",
    searchTNMarkets: "तमिलनाडु बाजार खोजें",
    searchPlaceholder: "बाजार के नाम से खोजें...",
    topTNMarketsByPrice: "मूल्य के अनुसार शीर्ष तमिलनाडु बाजार",
    topMarketsDescription: "तमिलनाडु में उच्चतम मूल्य वाले बाजार",
    priceByMarket: "बाजार के अनुसार मूल्य",
    showingResults: "{count} परिणाम दिखा रहे हैं",
    market: "बाजार",
    cropType: "फसल का प्रकार",
    lastUpdated: "अंतिम अपडेट",
    noResultsFound: "कोई परिणाम नहीं मिला",
    crops: {
      Onion: "प्याज",
      Groundnut: "मूंगफली",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem("onion-calculator-language");
    return (stored as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("onion-calculator-language", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
