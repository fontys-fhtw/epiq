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
      redirectTo: "http://localhost:3000",
    },
  });
}

export {
  getCustomerSession,
  getGPTSuggestions,
  getRestaurantMenu,
  authUser,
  signOut,
};
