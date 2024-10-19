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
  getRestaurantCategories,
  getRestaurantDishes,
  getRestaurantMenu,
  signOut,
};
