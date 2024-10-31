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

function getTables(client) {
  return client.from("restaurant-tables").select("*");
}

function addTable(client, table) {
  return client.from("restaurant-tables").insert(table);
}

function editTable(client, tableId, updatedTable) {
  return client
    .from("restaurant-tables")
    .update(updatedTable)
    .eq("tableId", tableId);
}

function deleteTable(client, tableId) {
  console.log("Deleting table with ID:", tableId);
  return client.from("restaurant-tables").delete().eq("tableId", tableId);
}

export {
  addTable,
  deleteTable,
  editTable,
  getOrders,
  getReservations,
  getTables,
};
