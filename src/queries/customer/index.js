import getURL from "@src/utils/url";
import axios from "axios";

async function getGPTSuggestions(restaurantId) {
  const response = await axios.post("/api/customer/suggestions", {
    restaurantId,
  });
  return response.data;
}

function getRestaurantMenu(client, restaurantId) {
  // restaurantId must be used to fetch a menu for a specific restaurant
  return client.from("restaurant-menu").select("*");
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
      redirectTo: getURL().customer,
    },
  });
}

export {
  authUser,
  getCustomerSession,
  getGPTSuggestions,
  getRestaurantMenu,
  signOut,
};
