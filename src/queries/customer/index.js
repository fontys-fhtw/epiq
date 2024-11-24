import getBaseUrl from "@src/utils/url";
import axios from "axios";

async function getGPTSuggestions() {
  const response = await axios.post("/api/customer/suggestions");
  return response.data;
}

function getRestaurantMenu(client) {
  return client.from("restaurant-menu-categories").select(`
      category:categoryName, 
      dishes:restaurant-menu (
        id, 
        name, 
        description, 
        price, 
        ingredients:resturant-dish-ingredients (
          id:ingredientId, 
          quantity, 
          details:resturant-ingredients (ingredientName) 
        )
      )
    `);
}

function getRestaurantDishes(client) {
  return client.from("restaurant-menu").select("id, name");
}

async function getRestaurantCategories(client) {
  return client.from("restaurant-menu-categories").select("*");
}

function addReferral(client, { referrerId, referredUserId }) {
  return client
    .from("user-referrals")
    .insert([{ referrer_id: referrerId, referred_user_id: referredUserId }])
    .select()
    .single();
}

function getUserCredits(client, userId) {
  return client
    .from("user-credits")
    .select("available_credit, total_earned")
    .eq("user_id", userId)
    .single();
}

function checkReferralExists(client, referrerId, referredUserId) {
  return client
    .from("user-referrals")
    .select("*")
    .eq("referrer_id", referrerId)
    .eq("referred_user_id", referredUserId)
    .maybeSingle();
}

async function initializeUserCredits(client, userId) {
  const userCredits = await getUserCredits(client, userId);

  if (userCredits.data) {
    return userCredits;
  }

  return client.from("user-credits").insert({
    user_id: userId,
  });
}

async function addUserCredits(client, { userId, amount }) {
  const { data } = await getUserCredits(client, userId);

  const availableCredit = data.available_credit + amount;
  const totalEarned = data.total_earned + amount;

  return client
    .from("user-credits")
    .update({
      available_credit: availableCredit,
      total_earned: totalEarned,
    })
    .eq("user_id", userId);
}

async function getOrderHistory(client, id) {
  // Fetch the list of order IDs for the user
  const { data: ordersData } = await client
    .from("orders")
    .select("orderid")
    .eq("userid", id);

  if (!ordersData || ordersData.length === 0) {
    return [];
  }
  const orderIds = ordersData.map((order) => order.orderid);

  // Fetch the order items based on the order IDs
  const { data: orderItemsData } = await client
    .from("order_items")
    .select("restaurant-menu (name)")
    .in("orderid", orderIds);

  return orderItemsData.map((item) => item["restaurant-menu"].name);
}

async function getCustomerSession(client) {
  return client.auth.getSession();
}

async function signOut(client) {
  return client.auth.signOut();
}

async function authUser(client, referrerId) {
  client.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getBaseUrl().api}auth/callback/${referrerId}`,
    },
  });
}

function getOrderItems(client, orderId) {
  return client
    .from("order_items")
    .select(" *, dish: dishid ( id, name, price)")
    .eq("orderid", orderId);
}

function getOrderStatus(client, orderId) {
  return client.from("orders").select("*").eq("orderid", orderId).single();
}

function addReservation(client, reservation) {
  return client.from("resturant-reservations").insert(reservation);
}

function getReservation(client, userId) {
  return client.from("resturant-reservations").select("*").eq("userId", userId);
}

async function getAvailableTable(client, dateInput, numberOfPeople) {
  // Ensure the dateInput is properly converted to a JavaScript Date object
  const date = new Date(dateInput);

  // Check if the date is valid
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }
  const oneHourBefore = new Date(date.getTime() - 60 * 60 * 1000)
    .toString()
    .slice(3, 21)
    .replace("T", " ");
  const oneHourAfter = new Date(date.getTime() + 60 * 60 * 1000)
    .toString()
    .slice(3, 21)
    .replace("T", " ");
  // First, find all tables that have a reservation within the given time range
  const { data: reservedTables, error: reservationError } = await client
    .from("resturant-reservations") // Make sure this matches your actual table name
    .select("tableId") // Ensure 'tableId' matches your actual column name
    .gte("dateTime", oneHourBefore)
    .lte("dateTime", oneHourAfter);

  if (reservationError) {
    console.error("Error fetching reservations:", reservationError);
    return null;
  }

  // Extract the table_ids of reserved tables
  const reservedTableIds = reservedTables
    ? `(${reservedTables.map((reservation) => reservation.tableId).join(", ")})`
    : "";
  // Prepare the query for available tables
  const query = client
    .from("restaurant-tables")
    .select("tableId, maxPeopleAmount")
    .gte("maxPeopleAmount", numberOfPeople)
    .order("maxPeopleAmount", { ascending: true }) // Sort by min max_amount_people
    .limit(1); // Return only the first available table

  // Apply the not.in filter only if there are reserved tables
  if (reservedTableIds.length > 0) {
    query.not("tableId", "in", reservedTableIds);
  }

  // Execute the query to find the first available table
  const { data: availableTable, error: tableError } = await query;

  if (tableError) {
    console.error("Error fetching available table:", tableError);
    return null;
  }

  return availableTable.length > 0 ? availableTable[0] : null; // Return the first available table
}

function deleteReservation(client, reservationId) {
  return client
    .from("resturant-reservations")
    .delete()
    .eq("reservationId", reservationId);
}

export {
  addReferral,
  addReservation,
  addUserCredits,
  authUser,
  checkReferralExists,
  deleteReservation,
  getAvailableTable,
  getCustomerSession,
  getGPTSuggestions,
  getOrderHistory,
  getOrderItems,
  getOrderStatus,
  getReservation,
  getRestaurantCategories,
  getRestaurantDishes,
  getRestaurantMenu,
  getUserCredits,
  initializeUserCredits,
  signOut,
};
