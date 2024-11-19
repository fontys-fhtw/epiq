"use client";

import { addNewIngredient } from "@src/queries/admin";
import { useState } from "react";

export default function NewIngredientForm({ supabase, refetchIngredients }) {
  const [newIngredientName, setNewIngredientName] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleNewIngredientChange = (e) => {
    setNewIngredientName(e.target.value);
  };

  const handleAddNewIngredient = async () => {
    setErrorMessage(null);
    if (!newIngredientName.trim()) {
      setErrorMessage("Ingredient name is required");
      return;
    }

    await addNewIngredient(supabase, newIngredientName);
    setNewIngredientName("");
    refetchIngredients();
  };

  return (
    <div className="mt-4">
      {errorMessage && (
        <span className="me-2 ml-2 rounded-t bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          {errorMessage}
        </span>
      )}
      <div className="rounded border p-4">
        <h3 className="font-bold">Add New Ingredient</h3>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newIngredientName}
            onChange={handleNewIngredientChange}
            placeholder="New Ingredient Name"
            className="rounded border p-2"
          />
          <button
            className="rounded bg-green-500 p-2 text-white"
            onClick={handleAddNewIngredient}
          >
            Add New Ingredient
          </button>
        </div>
      </div>
    </div>
  );
}
