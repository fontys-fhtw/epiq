"use client";

import { deleteDish } from "@src/queries/admin";

import DishForm from "./DishForm";

export default function DishCard({
  dish,
  supabase,
  refetchMenu,
  availableIngredients,
  categories,
  handleEditClick,
}) {
  const handleDeleteClick = async () => {
    if (confirm("Do you really want to delete this dish?")) {
      await deleteDish(supabase, dish.id);
      refetchMenu();
    }
  };

  return (
    <div className="mb-2 rounded border p-4">
      <h4 className="font-bold">{dish.name}</h4>
      <p>{dish.description}</p>
      <p className="font-semibold">${dish.price.toFixed(2)}</p>

      {/* Display ingredients */}
      <h5 className="mt-2 font-semibold">Ingredients:</h5>
      <ul className="ml-4 list-disc">
        {dish.ingredients.map((ingredient) => (
          <li key={ingredient.id}>
            {ingredient.details.ingredientName} - {ingredient.quantity}
          </li>
        ))}
      </ul>

      {/* Edit Dish */}
      <button
        className="mt-2 rounded bg-blue-500 p-2 text-white"
        onClick={() => handleEditClick(dish)}
      >
        Edit
      </button>

      {/* Delete Dish */}
      <button
        className="ml-2 mt-2 rounded bg-red-500 p-2 text-white"
        onClick={handleDeleteClick}
      >
        Delete
      </button>
    </div>
  );
}
