export default function IngredientList({
  formData,
  setFormData,
  availableIngredients,
}) {
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index][field] = value;
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const addNewIngredientField = () => {
    setFormData({
      ...formData,
      ingredients: [
        ...formData.ingredients,
        { ingredientId: "", quantity: "" },
      ],
    });
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  return (
    <div>
      <h4 className="mt-2 font-bold">Ingredients</h4>
      {formData.ingredients.map((ingredient, index) => (
        <div
          key={`${ingredient.details.ingredientName}`}
          className="mb-2 flex gap-2"
        >
          <select
            value={ingredient.ingredientId}
            onChange={(e) =>
              handleIngredientChange(index, "ingredientId", e.target.value)
            }
            className="rounded border p-2 text-black"
          >
            <option value="" disabled>
              Select Ingredient
            </option>
            {availableIngredients.map((ing) => (
              <option key={ing.id} value={ing.id}>
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
            className="rounded border p-2"
          />
          <button
            className="rounded bg-red-500 p-2 text-white"
            onClick={() => handleRemoveIngredient(index)}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        className="rounded bg-blue-500 p-2 text-white"
        onClick={addNewIngredientField}
      >
        Add Ingredient
      </button>
    </div>
  );
}
