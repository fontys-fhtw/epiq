"use client";

import { useState, useEffect } from "react";
import {
  getRestaurantMenu,
  addDish,
  deleteDish,
  editDish,
  getRestaurantCategories,
  getAvailableIngredients,
  addNewIngredient,
  addDishIngredients,
} from "@src/queries/admin";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";

export default function AdminRestaurantMenu() {
  const supabase = createSupabaseBrowserClient();

  const [categories, setCategories] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    ingredients: [{ ingredientId: "", quantity: "" }],
  });
  const [newIngredientName, setNewIngredientName] = useState("");
  const [editingDishId, setEditingDishId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [newIngredientErrorMessage, setNewIngredientErrorMessage] =
    useState(null);

  useEffect(() => {
    // Fetch categories and ingredients when Component mounts to page
    const fetchCategoriesAndIngredients = async () => {
      const { data: categoriesData, error: categoriesError } =
        await getRestaurantCategories(supabase);
      const { data: ingredientsData, error: ingredientsError } =
        await getAvailableIngredients(supabase);

      if (!categoriesError) {
        setCategories(categoriesData);
      } else {
        setErrorMessage("Error fetching categories:", categoriesError);
      }

      if (!ingredientsError) {
        setAvailableIngredients(ingredientsData);
      } else {
        setErrorMessage("Error fetching ingredients:", ingredientsError);
      }
    };

    const fetchMenu = async () => {
      const { data, error } = await getRestaurantMenu(supabase);
      if (!error) {
        setMenuData(data);
      } else {
        setErrorMessage("Error fetching menu:", error);
      }
    };

    fetchCategoriesAndIngredients();
    fetchMenu();
  }, [supabase]);

  // Refetches the menu, used to update Menu after operations.
  const refetchMenu = async () => {
    const { data, error } = await getRestaurantMenu(supabase);
    if (!error) {
      setMenuData(data);
    }
  };

  // Resets the form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      ingredients: [{ ingredientId: "", quantity: "" }],
    });
    setEditingDishId(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // updates changed Ingredients to the formData
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index][field] = value;
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  // handles adding new ingredients fields
  const addNewIngredientField = () => {
    setFormData({
      ...formData,
      ingredients: [
        ...formData.ingredients,
        { ingredientId: "", quantity: "" },
      ],
    });
  };

  // Adds or Edits a dish, depending on what User has chosen
  // Starts with validating the fields then proceeds with server calls
  // Refetches the Menu and Resets the form on successful workflow
  const handleAddOrEditDish = async () => {
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage("Dish name is required");
      return;
    }

    if (!formData.description.trim()) {
      setErrorMessage("Description is required");
      return;
    }

    if (!formData.price || Number.isNaN(parseFloat(formData.price))) {
      setErrorMessage("A valid price is required");
      return;
    }

    if (!formData.categoryId) {
      setErrorMessage("Please select a category");
      return;
    }

    if (
      formData.ingredients.length === 0 ||
      formData.ingredients.some(
        (ing) => !ing.ingredientId || !ing.quantity.trim()
      )
    ) {
      setErrorMessage("Please add at least one ingredient with valid quantity");
      return;
    }

    const dish = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      categoryId: formData.categoryId,
    };

    if (editingDishId) {
      await editDish(supabase, editingDishId, dish);
      await addDishIngredients(supabase, editingDishId, formData.ingredients);
      setEditingDishId(null);
    } else {
      const { data: newDishData } = await addDish(supabase, dish);
      await addDishIngredients(supabase, newDishData.id, formData.ingredients);
    }

    refetchMenu();
    resetForm();
  };

  // Navigates to the form, populates form with dishData of selected dish to edit
  const handleEditClick = (dish) => {
    document.getElementById("menuForm").scrollIntoView({ behavior: "smooth" });
    setFormData({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      categoryId: dish.categoryId,
      ingredients: dish.ingredients.map((ingredient) => ({
        ingredientId: ingredient.id,
        quantity: ingredient.quantity,
        ingredientName: ingredient.details.ingredientName,
      })),
    });
    setEditingDishId(dish.id);
  };

  // Delete dish after confirmation
  const handleDeleteClick = async (dishId) => {
    if (confirm("Do you really want to delete this dish?")) {
      await deleteDish(supabase, dishId);
      refetchMenu();
    }
  };

  // Refetching Ingredients after adding a new ingredient in order for it to be available in the form
  const refetchIngredients = async () => {
    const { data: ingredientsData, error: ingredientsError } =
      await getAvailableIngredients(supabase);
    if (!ingredientsError) {
      setAvailableIngredients(ingredientsData);
    } else {
      setErrorMessage("Error refetching ingredients:", ingredientsError);
    }
  };

  const handleNewIngredientChange = (e) => {
    setNewIngredientName(e.target.value);
  };

  // Validates `IngredientName` and adds a new Ingredient
  const handleAddNewIngredient = async () => {
    setNewIngredientErrorMessage(null);
    if (!newIngredientName.trim()) {
      setNewIngredientErrorMessage("Ingredient name is required");
      return;
    }

    await addNewIngredient(supabase, newIngredientName);
    setNewIngredientName(""); // Reset new ingredient field
    refetchIngredients(); // Refetch ingredients after adding a new one
  };

  return (
    <div className="flex flex-row gap-4">
      <div id="menuForm" className="basis-1/4 sticky top-0">
        <h2 className="text-2xl font-bold text-center mb-2">
          Manage Restaurant Menu
        </h2>
        {errorMessage && (
          <span class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-t ml-2 dark:bg-red-800 dark:text-red-200">
            {errorMessage}
          </span>
        )}
        {/* Add/Edit Dish Form */}

        <div className="p-4 border rounded">
          <h3 className="font-bold">
            {editingDishId ? "Edit Dish" : "Add New Dish"}
          </h3>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Dish Name"
              className="border rounded p-2"
            />
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="border rounded p-2"
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Price"
              className="border rounded p-2"
            />

            {/* Dropdown for Categories */}
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="border rounded p-2 text-black"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((category) => (
                <option
                  className="text-black"
                  key={category.categoryId}
                  value={category.categoryId}
                >
                  {category.categoryName}
                </option>
              ))}
            </select>

            {/* Ingredients */}
            <h4 className="font-bold mt-2">Ingredients</h4>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={ingredient.ingredientId}
                  onChange={(e) =>
                    handleIngredientChange(
                      index,
                      "ingredientId",
                      e.target.value
                    )
                  }
                  className="border rounded p-2 text-black"
                >
                  <option value="" disabled>
                    Select Ingredient
                  </option>
                  {availableIngredients.map((ing) => (
                    <option key={ing.id} value={ing.ingredientId}>
                      {ing.ingredientName}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    handleIngredientChange(index, "quantity", e.target.value)
                  }
                  placeholder="Quantity"
                  className="border rounded p-2"
                />
              </div>
            ))}

            {/* Button to Add More Ingredients */}
            <button
              className="bg-blue-500 text-white rounded p-2"
              onClick={addNewIngredientField}
            >
              Add Ingredient
            </button>

            <button
              className="bg-green-500 text-white rounded p-2"
              onClick={handleAddOrEditDish}
            >
              {editingDishId ? "Update Dish" : "Add Dish"}
            </button>
          </div>
        </div>

        {/* Add New Ingredient Section */}
        <div className="mt-4">
          {newIngredientErrorMessage && (
            <span class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-t ml-2 dark:bg-red-800 dark:text-red-200">
              {newIngredientErrorMessage}
            </span>
          )}
          <div className="p-4 border rounded">
            <h3 className="font-bold">Add New Ingredient</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newIngredientName}
                onChange={handleNewIngredientChange}
                placeholder="New Ingredient Name"
                className="border rounded p-2"
              />
              <button
                className="bg-green-500 text-white rounded p-2"
                onClick={handleAddNewIngredient}
              >
                Add New Ingredient
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* List of Dishes */}
      <div className="basis-3/4">
        <h2 className="font-bold text-2xl text-center">Current Menu</h2>
        {menuData?.map(({ category, dishes }) => (
          <div key={category.id} className="mt-4">
            <h4 className="text-xl font-semibold">{category}</h4>
            <h2>{!dishes[0] ? "No " + category + " yet." : ""}</h2>
            {dishes.map((dish) => (
              <div key={dish.id} className="border p-4 rounded mb-2">
                <h4 className="font-bold">{dish.name}</h4>
                <p>{dish.description}</p>
                <p className="font-semibold">${dish.price.toFixed(2)}</p>

                {/* Display ingredients */}
                <h5 className="font-semibold mt-2">Ingredients:</h5>
                <ul className="ml-4 list-disc">
                  {dish.ingredients.map((ingredient) => (
                    <li key={ingredient.id}>
                      {ingredient.details.ingredientName} -{" "}
                      {ingredient.quantity}
                    </li>
                  ))}
                </ul>

                {/* Edit Dish */}
                <button
                  className="bg-blue-500 text-white rounded p-2 mt-2"
                  onClick={() => handleEditClick(dish)}
                >
                  Edit
                </button>

                {/* Delete Dish */}
                <button
                  className="bg-red-500 text-white rounded p-2 mt-2 ml-2"
                  onClick={() => handleDeleteClick(dish.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
