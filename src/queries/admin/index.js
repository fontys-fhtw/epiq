import axios from "axios";

const getOrders = async () => {
  const response = await axios.get("/api/admin/orders");
  return response.data; // Axios automatically parses JSON, so return response.data
};

const getReservations = async () => {
  const response = await axios.get("/api/admin/reservations");
  return response.data;
};

// Query to insert dishes into the menu table
export async function uploadMenu(client, menuItems) {
  const { data, error } = await client
    .from("restaurant-menu")
    .insert(menuItems);

  if (error) {
    console.error("Error uploading menu:", error);
  }

  return data;
}

export { getOrders, getReservations };
