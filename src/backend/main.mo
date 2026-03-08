import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Float "mo:core/Float";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  ///////////////////////
  // Type Definitions  //
  ///////////////////////

  public type CropType = {
    #onion;
    #groundnut;
  };

  public type Market = {
    id : Nat;
    name : Text;
    location : Text;
    region : Text;
  };

  public type PriceRecord = {
    id : Nat;
    date : Time.Time;
    marketId : Nat;
    cropType : CropType;
    pricePerKg : Nat;
    source : Text;
    validated : Bool;
  };

  public type AlertCondition = {
    marketId : Nat;
    cropType : CropType;
    targetPrice : Nat;
    above : Bool;
    isPersistent : Bool;
    active : Bool;
  };

  public type NotificationPreference = {
    pushEnabled : Bool;
    smsEnabled : Bool;
    notificationFrequency : Nat;
    notificationTypes : [Text];
  };

  public type UserProfile = {
    name : Text;
    notificationPreferences : NotificationPreference;
  };

  public type UserData = {
    principal : Principal;
    profile : UserProfile;
    alerts : List.List<AlertCondition>;
    notificationHistory : List.List<Text>;
  };

  public type Notification = {
    id : Nat;
    userPrincipal : Principal;
    message : Text;
    notificationType : Text;
    timestamp : Time.Time;
    delivered : Bool;
  };

  public type MarketSummary = {
    totalRecords : Nat;
    averagePrice : Nat;
    minPrice : Nat;
    maxPrice : Nat;
    priceTrend : [Nat];
  };

  public type TrendsData = {
    dailyTrends : [MarketSummary];
    weeklyTrends : [MarketSummary];
    monthlyTrends : [MarketSummary];
  };

  public type LivePriceRecord = {
    market : Text;
    state : Text;
    region : Text;
    cropType : CropType;
    pricePerKg : Nat;
    timestamp : Time.Time;
  };

  public type TransactionRecord = {
    farmerName : Text;
    laborName : Text;
    weightKg : Float;
    pricePerKg : Float;
    totalAmount : Float;
    mobileNumber : Text;
    timestamp : Int;
  };

  ////////////////////////////
  // Authorization System   //
  ////////////////////////////

  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  ////////////////////////////
  // Persistent State       //
  ////////////////////////////

  var marketIdCounter : Nat = 0;
  var priceRecordIdCounter : Nat = 0;
  var notificationIdCounter : Nat = 0;

  let markets = Map.empty<Nat, Market>();
  let priceRecords = Map.empty<Nat, PriceRecord>();
  let notifications = Map.empty<Nat, Notification>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userAlerts = Map.empty<Principal, List.List<AlertCondition>>();
  let userNotificationHistory = Map.empty<Principal, List.List<Text>>();
  let livePriceCache = Map.empty<Text, [LivePriceRecord]>();

  var transactions : [TransactionRecord] = [];

  ////////////////////////////
  // User Profile Management//
  ////////////////////////////

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin-only: Get all user profiles for dashboard
  public query ({ caller }) func getAllUserProfiles() : async [(Principal, UserProfile)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can view all user profiles");
    };
    userProfiles.entries().toArray();
  };

  ////////////////////////////
  // Market Management      //
  ////////////////////////////

  public shared ({ caller }) func addMarket(name : Text, location : Text, region : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can add markets");
    };

    switch (markets.values().find(func(m) { m.name == name })) {
      case (null) {};
      case (_) { Runtime.trap("Market with given name already exists") };
    };

    let newId = marketIdCounter;
    let newMarket : Market = {
      id = newId;
      name;
      location;
      region;
    };
    markets.add(newId, newMarket);
    marketIdCounter += 1 : Nat;
    newId;
  };

  // Public access: Anyone can view markets for browsing
  public query func getMarkets() : async [Market] {
    markets.values().toArray();
  };

  public shared ({ caller }) func deleteMarket(marketId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can delete markets");
    };

    // Check if market is referenced by any price records
    let hasReferences = priceRecords.values().find(func(record) { record.marketId == marketId });
    switch (hasReferences) {
      case (?_) { Runtime.trap("Cannot delete market: referenced by existing price records") };
      case (null) {};
    };

    markets.remove(marketId);
  };

  public shared ({ caller }) func updateMarket(marketId : Nat, name : Text, location : Text, region : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can update markets");
    };

    switch (markets.get(marketId)) {
      case (null) { Runtime.trap("Market not found") };
      case (?_) {
        let updatedMarket : Market = {
          id = marketId;
          name;
          location;
          region;
        };
        markets.add(marketId, updatedMarket);
      };
    };
  };

  ////////////////////////////
  // Price Data Management  //
  ////////////////////////////

  public shared ({ caller }) func addPriceRecord(marketId : Nat, cropType : CropType, pricePerKg : Nat, source : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can add price records");
    };
    switch (markets.get(marketId)) {
      case (null) { Runtime.trap("Invalid market ID") };
      case (_) {};
    };

    let newId = priceRecordIdCounter;
    let newRecord : PriceRecord = {
      id = newId;
      date = Time.now();
      marketId;
      cropType;
      pricePerKg;
      source;
      validated = false;
    };
    priceRecords.add(newId, newRecord);
    priceRecordIdCounter += 1 : Nat;
    newId;
  };

  // Public access: Anyone can view market prices for browsing
  public query func getMarketPrices(marketId : Nat, cropType : CropType) : async [PriceRecord] {
    priceRecords.filter(
      func(_id, record) { record.marketId == marketId and record.cropType == cropType }
    ).values().toArray();
  };

  // Admin-only: aggregated price data across all markets
  public query ({ caller }) func getAllPrices() : async [PriceRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can view all price records");
    };
    priceRecords.values().toArray();
  };

  public shared ({ caller }) func validatePriceRecord(recordId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can validate price records");
    };

    switch (priceRecords.get(recordId)) {
      case (null) { Runtime.trap("Price record not found") };
      case (?record) {
        let validatedRecord : PriceRecord = {
          id = record.id;
          date = record.date;
          marketId = record.marketId;
          cropType = record.cropType;
          pricePerKg = record.pricePerKg;
          source = record.source;
          validated = true;
        };
        priceRecords.add(recordId, validatedRecord);
      };
    };
  };

  ////////////////////////////
  // Trends Analysis        //
  ////////////////////////////

  // Public access: Anyone can view trends for market intelligence
  public query func getTrendsData() : async TrendsData {
    let getMarketSummary = func(marketId : Nat, cropType : CropType) : MarketSummary {
      let records = priceRecords.filter(
        func(_id, record) { record.marketId == marketId and record.cropType == cropType }
      ).values().toArray();

      let totalRecords = records.size();
      let averagePrice = switch (totalRecords == 0) {
        case (true) { 0 };
        case (false) {
          var sum = 0;
          records.forEach(func(record) { sum += record.pricePerKg });
          sum / totalRecords;
        };
      };
      let minPrice = switch (totalRecords == 0) {
        case (true) { 0 };
        case (false) {
          records.foldLeft(records[0].pricePerKg, func(acc, record) { if (record.pricePerKg < acc) { record.pricePerKg } else { acc } });
        };
      };
      let maxPrice = switch (totalRecords == 0) {
        case (true) { 0 };
        case (false) {
          records.foldLeft(records[0].pricePerKg, func(acc, record) { if (record.pricePerKg > acc) { record.pricePerKg } else { acc } });
        };
      };

      let priceTrend = records.map(func(record) { record.pricePerKg });

      {
        totalRecords;
        averagePrice;
        minPrice;
        maxPrice;
        priceTrend;
      };
    };

    // For demonstration, using fixed timeframes
    // In production, would filter by daily, weekly, monthly

    let dailyTrends = [
      getMarketSummary(1, #onion),
    ];
    let weeklyTrends = [
      getMarketSummary(1, #onion),
    ];
    let monthlyTrends = [
      getMarketSummary(1, #onion),
    ];

    {
      dailyTrends;
      weeklyTrends;
      monthlyTrends;
    };
  };

  ////////////////////////////
  // Live Market Prices     //
  ////////////////////////////

  // Public access: Anyone can view live market prices for browsing
  public query func getTNPrices(cropType : CropType) : async [LivePriceRecord] {
    let cacheKey = debug_show (cropType) # "TamilNadu";
    
    switch (livePriceCache.get(cacheKey)) {
      case (?cached) { cached };
      case (null) { [] };
    };
  };

  // Admin-only: Update specific TN crop price cache
  public shared ({ caller }) func updateTNPriceCache(cropType : CropType, prices : [LivePriceRecord]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can update TN price cache");
    };

    let cacheKey = debug_show (cropType) # "TamilNadu";
    livePriceCache.add(cacheKey, prices);
  };

  ////////////////////////////
  // Alert System           //
  ////////////////////////////

  func isDuplicateAlert(alerts : List.List<AlertCondition>, newAlert : AlertCondition) : Bool {
    alerts.find(func(alert) {
      alert.marketId == newAlert.marketId
      and alert.cropType == newAlert.cropType
      and alert.targetPrice == newAlert.targetPrice
      and alert.above == newAlert.above
    }) != null;
  };

  // Users can create their own alerts
  public shared ({ caller }) func createAlert(marketId : Nat, cropType : CropType, targetPrice : Nat, above : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create alerts");
    };

    // Validate market exists
    switch (markets.get(marketId)) {
      case (null) { Runtime.trap("Invalid market ID") };
      case (_) {};
    };

    let isPersistent = false;
    let active = true;
    let alert : AlertCondition = {
      marketId;
      cropType;
      targetPrice;
      above;
      isPersistent;
      active;
    };

    let currentAlerts = switch (userAlerts.get(caller)) {
      case (null) { List.empty<AlertCondition>() };
      case (?alerts) { alerts };
    };

    // Check for duplicate alerts
    if (isDuplicateAlert(currentAlerts, alert)) {
      Runtime.trap("Duplicate alert: An identical alert already exists");
    };

    currentAlerts.add(alert);
    userAlerts.add(caller, currentAlerts);
  };

  public query ({ caller }) func getUserAlerts() : async [AlertCondition] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view alerts");
    };

    switch (userAlerts.get(caller)) {
      case (null) { [] };
      case (?alerts) { alerts.toArray() };
    };
  };

  public query ({ caller }) func getActiveAlerts() : async [AlertCondition] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view alerts");
    };

    switch (userAlerts.get(caller)) {
      case (null) { [] };
      case (?alerts) { alerts.filter(func(alert) { alert.active }).toArray() };
    };
  };

  public query ({ caller }) func getInactiveAlerts() : async [AlertCondition] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view alerts");
    };

    switch (userAlerts.get(caller)) {
      case (null) { [] };
      case (?alerts) { alerts.filter(func(alert) { not alert.active }).toArray() };
    };
  };

  public shared ({ caller }) func toggleAlert(marketId : Nat, cropType : CropType, targetPrice : Nat, above : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can toggle alerts");
    };

    switch (userAlerts.get(caller)) {
      case (null) { Runtime.trap("No alerts found for user") };
      case (?alerts) {
        let updatedAlerts = alerts.map<AlertCondition, AlertCondition>(
          func(alert) {
            if (alert.marketId == marketId and alert.cropType == cropType and 
                alert.targetPrice == targetPrice and alert.above == above) {
              {
                marketId = alert.marketId;
                cropType = alert.cropType;
                targetPrice = alert.targetPrice;
                above = alert.above;
                isPersistent = alert.isPersistent;
                active = not alert.active;
              };
            } else {
              alert;
            };
          }
        );
        userAlerts.add(caller, updatedAlerts);
      };
    };
  };

  public shared ({ caller }) func deleteAlert(marketId : Nat, cropType : CropType, targetPrice : Nat, above : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete alerts");
    };

    switch (userAlerts.get(caller)) {
      case (null) { Runtime.trap("No alerts found for user") };
      case (?alerts) {
        let filteredAlerts = alerts.filter(func(alert) {
          not (alert.marketId == marketId and alert.cropType == cropType and 
               alert.targetPrice == targetPrice and alert.above == above)
        });
        userAlerts.add(caller, filteredAlerts);
      };
    };
  };

  // Admin-only: view all alerts across all users for monitoring
  public query ({ caller }) func getAllUserAlerts() : async [(Principal, [AlertCondition])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can view all user alerts");
    };
    
    userAlerts.entries().map(func((principal, alerts)) {
      (principal, alerts.toArray())
    }).toArray();
  };

  ////////////////////////////
  // Notification System    //
  ////////////////////////////

  public shared ({ caller }) func sendNotification(userPrincipal : Principal, message : Text, notificationType : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can send notifications");
    };

    let newId = notificationIdCounter;
    let notification : Notification = {
      id = newId;
      userPrincipal;
      message;
      notificationType;
      timestamp = Time.now();
      delivered = false;
    };
    notifications.add(newId, notification);
    notificationIdCounter += 1 : Nat;
  };

  public query ({ caller }) func getUserNotifications() : async [Notification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view notifications");
    };

    notifications.filter(
      func(_id, notification) { notification.userPrincipal == caller }
    ).values().toArray();
  };

  public query ({ caller }) func getAllNotifications() : async [Notification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can view all notifications");
    };
    notifications.values().toArray();
  };

  public shared ({ caller }) func markNotificationDelivered(notificationId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can update notification status");
    };

    switch (notifications.get(notificationId)) {
      case (null) { Runtime.trap("Notification not found") };
      case (?notification) {
        let updatedNotification : Notification = {
          id = notification.id;
          userPrincipal = notification.userPrincipal;
          message = notification.message;
          notificationType = notification.notificationType;
          timestamp = notification.timestamp;
          delivered = true;
        };
        notifications.add(notificationId, updatedNotification);
      };
    };
  };

  ////////////////////////////
  // Transaction Recorder   //
  ////////////////////////////

  public shared ({ caller }) func saveTransaction(
    farmerName : Text,
    laborName : Text,
    weightKg : Float,
    pricePerKg : Float,
    totalAmount : Float,
    mobileNumber : Text,
    timestamp : Int
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save transactions");
    };

    let transactionRecord : TransactionRecord = {
      farmerName;
      laborName;
      weightKg;
      pricePerKg;
      totalAmount;
      mobileNumber;
      timestamp;
    };

    transactions := transactions.concat([transactionRecord]);
  };

  // Admin-only function to retrieve all transactions
  public query ({ caller }) func getTransactions() : async [TransactionRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can view transactions");
    };
    transactions;
  };

  public query ({ caller }) func checkAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };
};
