import getURL from "@src/utils/url";
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
      redirectTo: `${getURL().api}auth/callback/${referrerId}`,
    },
  });
}

export {
  addReferral,
  addUserCredits,
  authUser,
  checkReferralExists,
  getCustomerSession,
  getGPTSuggestions,
  getOrderHistory,
  getRestaurantCategories,
  getRestaurantDishes,
  getRestaurantMenu,
  getUserCredits,
  initializeUserCredits,
  signOut,
};
