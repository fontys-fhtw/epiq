"use client";

import { addNewCategory } from "@src/queries/admin";
import { useState } from "react";

export default function NewCategoryForm({ supabase, refetchCategories }) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleNewCategoryChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  const handleAddNewCategory = async () => {
    setErrorMessage(null);
    if (!newCategoryName.trim()) {
      setErrorMessage("Category name is required");
      return;
    }

    await addNewCategory(supabase, newCategoryName);
    setNewCategoryName("");
    refetchCategories();
  };

  return (
    <div className="mt-4">
      {errorMessage && (
        <span className="me-2 ml-2 rounded-t bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          {errorMessage}
        </span>
      )}
      <div className="rounded border p-4">
        <h3 className="font-bold">Add New Category</h3>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={handleNewCategoryChange}
            placeholder="New Category Name"
            className="rounded border p-2"
          />
          <button
            className="rounded bg-green-500 p-2 text-white"
            onClick={handleAddNewCategory}
          >
            Add New Category
          </button>
        </div>
      </div>
    </div>
  );
}
