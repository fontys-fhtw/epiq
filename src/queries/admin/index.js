import axios from "axios";

const getOrders = async () => {
  const response = await axios.get("/api/admin/orders");
  return response.data; // Axios automatically parses JSON, so return response.data
};

function getReservations(client) {
  return client
    .from("resturant-reservations")
    .select(
      "reservationId, dateTime, numberPeople, status:resturant-reservation-status (statusName), restaurant-tables (tableId)",
    );
}

function updateReservationStatus(client, reservationId, status) {
  return client
    .from("resturant-reservations")
    .update({ statusId: status })
    .eq("reservationId", reservationId);
}

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

export { getOrders, getReservations, updateReservationStatus };
