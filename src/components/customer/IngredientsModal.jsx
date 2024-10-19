export default function IngredientsModal({ isOpen, onClose, ingredients }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex h-screen items-end bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="h-fit w-full max-w-lg rounded-t-lg bg-gray-900 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-3xl font-bold text-white">Ingredients</h2>
        <ul className="list-none text-gray-300">
          {ingredients.map((ingredient) => (
            <li key={ingredient.id} className="border-b border-gray-700 py-2">
              <span className="font-semibold text-white">
                {ingredient.details.ingredientName}
              </span>{" "}
              - {ingredient.quantity}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="mt-6 w-full rounded bg-red-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-red-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
