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
  return client.from("restaurant-menu").select("id");
}

async function getRestaurantCategories(client) {
  return client.from("restaurant-menu-categories").select("*");
}

function addReferral(client, { giver, receiver }) {
  return client
    .from("user-referrals")
    .insert([{ giver_user_id: giver, receiver_user_id: receiver }])
    .select();
}

async function getOrderHistory(client) {
  // Fetch the list of order IDs for the user
  const {
    data: {
      user: { id },
    },
  } = await client.auth.getUser();
  const { data: ordersData, error: ordersError } = await client
    .from("orders")
    .select("orderid")
    .eq("userid", id);

  if (ordersError) {
    console.error("Error fetching orders:", ordersError);
    return null;
  }

  if (!ordersData || ordersData.length === 0) {
    console.log("No orders found for user.");
    return [];
  }

  const orderIds = ordersData.map((order) => order.orderid);

  // Fetch the order items based on the order IDs
  const { data: orderItemsData, error: orderItemsError } = await client
    .from("order_items")
    .select("restaurant-menu (name)")
    .in("orderid", orderIds);

  if (orderItemsError) {
    console.error("Error fetching order items:", orderItemsError);
    return null;
  }

  return orderItemsData.map((item) => item["restaurant-menu"].name);
}

async function getCustomerSession(client) {
  return client.auth.getSession();
}

async function signOut(client) {
  return client.auth.signOut();
}

async function authUser(client, referral) {
  client.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getURL().api}auth/callback/${referral}`,
    },
  });
}

export {
  addReferral,
  authUser,
  getCustomerSession,
  getGPTSuggestions,
  getOrderHistory,
  getRestaurantCategories,
  getRestaurantDishes,
  getRestaurantMenu,
  signOut,
};
