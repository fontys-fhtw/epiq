import getURL from "@src/utils/url";
import axios from "axios";

async function getGPTSuggestions() {
  const response = await axios.post("/api/customer/suggestions");
  return response.data;
}

function getRestaurantMenu(client) {
  return client.from("restaurant-menu").select("*");
}

function getRestaurantDishes(client) {
  return client.from("restaurant-menu").select("id,name");
}

async function getCustomerSession(client) {
  return client.auth.getSession();
}

async function signOut(client) {
  return client.auth.signOut();
}

async function authUser(client) {
  client.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getURL().api}auth/callback/`,
    },
  });
}

export {
  authUser,
  getCustomerSession,
  getGPTSuggestions,
  getRestaurantDishes,
  getRestaurantMenu,
  signOut,
};
