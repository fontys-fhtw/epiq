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
export {
  getCustomerSession,
  getGPTSuggestions,
  getRestaurantDishes,
  getRestaurantMenu,
  signIn,
  signOut,
  signUp,
};
