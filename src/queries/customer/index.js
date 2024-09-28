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
export { getRestaurantMenu, getSuggestions, signIn, signUp };
