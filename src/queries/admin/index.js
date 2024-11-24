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


function getReservations(client) {
  return client.from("resturant-reservations").select("*");
}

function updateReservationStatus(client, reservationId, newStatusId) {
  return client
    .from("resturant-reservations")
    .update({ statusId: newStatusId })
    .eq("reservationId", reservationId);
}

function getRestaurantMenu(client) {
  return client.from("restaurant-menu-categories").select(`
      category:categoryName, 
      dishes:restaurant-menu (
        id, 
        name, 
        description, 
        price, 
        categoryId,
        ingredients:resturant-dish-ingredients (
          id:ingredientId, 
          quantity, 
          details:resturant-ingredients (ingredientName) 
        )
      )
    `);
}

async function getRestaurantCategories(client) {
  return client.from("restaurant-menu-categories").select("*");
}

async function getAvailableIngredients(client) {
  return client.from("resturant-ingredients").select("*");
}

// Add a new dish to the database
async function addDish(client, dish) {
  const { data, error } = await client
    .from("restaurant-menu")
    .insert(dish)
    .select();

  return { data: data[0], error };
}

// Edit an existing dish
async function editDish(client, dishId, updatedDish) {
  const { data, error } = await client
    .from("restaurant-menu")
    .update(updatedDish)
    .eq("id", dishId);

  return { data, error };
}

// Delete a dish by dishId
async function deleteDish(client, dishId) {
  const { data, error } = await client
    .from("restaurant-menu")
    .delete()
    .eq("id", dishId);

  return { data, error };
}

async function addNewIngredient(client, ingredientName) {
  const { data, error } = await client
    .from("resturant-ingredients")
    .insert({
      ingredientName,
    })
    .select();

  return { data, error };
}

async function deleteDishIngredient(client, dishId, ingredientId) {
  const { data, error } = await client
    .from("resturant-dish-ingredients")
    .delete()
    .eq("dishId", dishId)
    .eq("ingredientId", ingredientId);

  return { data, error };
}

async function addNewCategory(client, categoryName) {
  const { data, error } = await client
    .from("restaurant-menu-categories")
    .insert({
      categoryName,
    })
    .select();

  return { data, error };
}


async function addDishIngredients(client, dishId, ingredients) {
  const ingredientData = ingredients.map((ingredient) => ({
    dishId,
    ingredientId: ingredient.ingredientId,
    quantity: ingredient.quantity,
  }));

  const { data, error } = await client
    .from("resturant-dish-ingredients")
    .insert(ingredientData);

  return { data, error };
}

async function updateDishIngredient(client, dishId, ingredient) {
  const { data, error } = await client
    .from("resturant-dish-ingredients")
    .update({ quantity: ingredient.quantity })
    .eq("dishId", dishId)
    .eq("ingredientId", ingredient.ingredientId);

  return { data, error };
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
  return client.from("restaurant-tables").delete().eq("tableId", tableId);
}

export {
  addDish,
  addDishIngredients,
  addNewCategory,
  addNewIngredient,
  addTable,
  deleteDish,
  deleteDishIngredient,
  deleteTable,
  editDish,
  editTable,
  getAvailableIngredients,
  getOrders,
  getReservations,
  updateOrderStatus,
  getRestaurantCategories,
  getRestaurantMenu,
  getTables,
  updateDishIngredient,
  updateReservationStatus,
};

