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

async function signUp(client, credentials) {
  return client.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        first_name: credentials.first_name,
        last_name: credentials.last_name,
      },
    },
  });
}
export { getRestaurantMenu, getGPTSuggestions, signIn, signUp };
