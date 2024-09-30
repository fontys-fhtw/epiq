import axios from "axios";

async function getGPTSuggestions(restaurantId) {
  const response = await axios.post("/api/customer/suggestions", {
    restaurantId,
  });
  return response.data;
}

function getRestaurantMenu(client, restaurantId) {
  console.info(restaurantId);
  // restaurantId must be used to fetch a menu for a specific restaurant
  return client.from("restaurant-menu").select("*");
}

async function signIn(client, credentials) {
  return client.auth.signInWithPassword(credentials);
}

export { getGPTSuggestions, getRestaurantMenu, signIn };
