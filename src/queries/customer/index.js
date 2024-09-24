import axios from "axios";

// Axios queries
async function getSuggestions() {
  const response = await axios.get("/api/customer/suggestions");
  return response.data; // Return the parsed response data
}

// Supabase queries
function getRestaurantMenu(client) {
  return client.from("restaurant-menu").select("*");
}

async function signIn(client, credentials) {
  return client.auth.signInWithPassword(credentials);
}

export { getRestaurantMenu, getSuggestions, signIn };
