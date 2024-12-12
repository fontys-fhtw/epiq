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

async function getMostPopularDishes(client) {
  const { data, error } = await client.rpc("get_most_popular_dishes");

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item) => item.dishid);
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

function getUserSettings(client, userId) {
  return client
    .from("user-settings")
    .select("settingsId:id,settings")
    .eq("user_id", userId)
    .single();
}

async function updateUserSettings(client, settingsId, updatedSettings) {
  return client
    .from("user-settings")
    .upsert({ id: settingsId, settings: updatedSettings });
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

async function deductUserCredits(client, { userId, amount }) {
  const { data } = await getUserCredits(client, userId);
  const availableCredit = Math.max(data.available_credit - amount, 0);

  return client
    .from("user-credits")
    .update({
      available_credit: availableCredit,
    })
    .eq("user_id", userId);
}

async function getOrderHistory(client, userId) {
  // Fetch the user's orders with related order_status and order_items including restaurant-menu details, sorted by created_at descendingly
  const { data: ordersData, error: ordersError } = await client
    .from("orders")
    .select(
      `
      orderid,
      created_at,
      statusid,
      total_amount,
      order_status (name),
      order_items (
        restaurant-menu (id, name, price)
      )
    `,
    )
    .eq("userid", userId)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Error fetching orders:", ordersError);
    return [];
  }

  if (!ordersData || ordersData.length === 0) {
    return [];
  }

  // Map the fetched data to the desired structure
  return ordersData.map((order) => ({
    orderid: order.orderid,
    created_at: order.created_at,
    statusid: order.statusid,
    statusName: order.order_status.name,
    total_amount: order.total_amount,
    items: order.order_items.map((item) => ({
      id: item["restaurant-menu"].id,
      name: item["restaurant-menu"].name,
      price: item["restaurant-menu"].price,
    })),
  }));
}

async function getCustomerSession(client) {
  return client.auth.getSession();
}

async function signOut(client) {
  return client.auth.signOut();
}

async function authUser(client, referrerId, redirectTo) {
  let callbackUrl;

  if (redirectTo) {
    callbackUrl = `${getBaseUrl().api}auth/callback/${referrerId}?redirectTo=${encodeURIComponent(redirectTo)}`;
  } else {
    callbackUrl = `${getBaseUrl().api}auth/callback/${referrerId}`;
  }
  client.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl,
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

async function payOrder(client, orderId) {
  return client.from("orders").update({ statusid: 1 }).eq("orderid", orderId);
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
  getMostPopularDishes,
  getOrderHistory,
  getOrderItems,
  getOrderStatus,
  getReservation,
  getRestaurantCategories,
  getRestaurantDishes,
  getRestaurantMenu,
  getUserCredits,
  deductUserCredits,
  getUserSettings,
  updateUserSettings,
  initializeUserCredits,
  payOrder,
  signOut,
};
