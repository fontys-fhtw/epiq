import axios from "axios";

const getOrders = async () => {
  const response = await axios.get("/api/admin/orders");
  return response.data; // Axios automatically parses JSON, so return response.data
};

const updateOrderStatus = async (orderId, newStatusId) => {
  try {
    await axios.put(`/api/admin/orders/${orderId}`, { statusid: newStatusId });
  } catch (error) {
    console.error("Error updating order status in API:", error);
    throw error;
  }
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

export { getOrders, getReservations, updateOrderStatus };
