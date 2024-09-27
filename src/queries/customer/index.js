function getRestaurantMenu(client) {
  return client.from("restaurant-menu").select("*");
}

async function signIn(client, credentials) {
  return client.auth.signInWithPassword(credentials);
}

export { getRestaurantMenu, signIn };
