import ActionButton from "../common/ActionButton";

export default function IngredientsModal({ isOpen, onClose, ingredients }) {
  if (!isOpen) return null;

  const isLastElement = (index) => ingredients.length === index + 1;

  return (
    <div
      className="fixed inset-0 flex h-screen items-end bg-darkBg bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="flex h-fit w-screen flex-col gap-4 rounded-t-lg bg-dark p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-white">Ingredients</h2>
        <ul className="list-none">
          {ingredients.map((ingredient, index) => (
            <li
              key={ingredient.id}
              className={`${isLastElement(index) ? "" : "border-b"} border-brown py-2`}
            >
              <span className="font-semibold text-white">
                {ingredient.details.ingredientName}
              </span>{" "}
              <span className="text-gray-200">- {ingredient.quantity}</span>
            </li>
          ))}
        </ul>
        <ActionButton onClick={onClose} className="w-full rounded-lg text-xl">
          Close
        </ActionButton>
      </div>
    </div>
  );
}
