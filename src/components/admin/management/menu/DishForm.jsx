"use client";

import {
  addDish,
  addDishIngredients,
  deleteDishIngredient,
  editDish,
  updateDishIngredient,
} from "@src/queries/admin";
import { useState } from "react";

import IngredientList from "./IngredientList";

export default function DishForm({
  supabase,
  categories,
  availableIngredients,
  refetchMenu,
  formData,
  setFormData,
  existingIngredients,
  setExistingIngredients,
  editingDishId,
  setEditingDishId,
}) {
  const [errorMessage, setErrorMessage] = useState(null);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      ingredients: [{ ingredientId: "", quantity: "" }],
    });
    setEditingDishId(null);
    setExistingIngredients([]);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for adding or editing a dish
  const handleAddOrEditDish = async () => {
    setErrorMessage(null);

    // Validation
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
        (ing) => !ing.ingredientId || !ing.quantity.trim(),
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

      // Determine which ingredients to add, update, or remove
      const updatedIngredientIds = formData.ingredients.map(
        (ing) => ing.ingredientId,
      );

      // 1. Remove ingredients
      const ingredientsToRemove = existingIngredients.filter(
        (existingIng) => !updatedIngredientIds.includes(existingIng.id),
      );

      ingredientsToRemove.forEach(async (ingredient) => {
        await deleteDishIngredient(supabase, editingDishId, ingredient.id);
      });

      // 2. Add new ingredients
      const newIngredients = formData.ingredients.filter(
        (ing) =>
          !existingIngredients.some(
            (existingIng) => existingIng.id === ing.ingredientId,
          ),
      );
      await addDishIngredients(supabase, editingDishId, newIngredients);

      // 3. Update existing ingredients
      const updatedIngredients = formData.ingredients.filter((ing) =>
        existingIngredients.some(
          (existingIng) =>
            existingIng.id === ing.ingredientId &&
            existingIng.quantity !== ing.quantity,
        ),
      );

      updatedIngredients.forEach(async (ingredient) => {
        await updateDishIngredient(supabase, editingDishId, ingredient);
      });
    } else {
      const { data: newDishData } = await addDish(supabase, dish);
      await addDishIngredients(supabase, newDishData.id, formData.ingredients);
    }

    await refetchMenu();
    resetForm();
  };

  return (
    <div className="rounded border p-4">
      <h3 className="font-bold">
        {editingDishId ? "Edit Dish" : "Add New Dish"}
      </h3>
      {errorMessage && (
        <span className="me-2 ml-2 rounded-t bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          {errorMessage}
        </span>
      )}
      <div className="flex flex-col gap-2">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Dish Name"
          className="rounded border p-2"
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="rounded border p-2"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Price"
          className="rounded border p-2"
        />

        {/* Dropdown for Categories */}
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleInputChange}
          className="rounded border p-2 text-black"
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

        {/* Ingredients List */}
        <IngredientList
          formData={formData}
          setFormData={setFormData}
          availableIngredients={availableIngredients}
        />

        <button
          className="rounded bg-green-500 p-2 text-white"
          onClick={handleAddOrEditDish}
        >
          {editingDishId ? "Update Dish" : "Add Dish"}
        </button>
      </div>
    </div>
  );
}
