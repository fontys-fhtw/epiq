import ActionButton from "../common/ActionButton";

export default function IngredientsModal({
  isOpen,
  onClose,
  ingredients,
  isDemo = false,
}) {
  if (!isOpen) return null;

  const isLastElement = (index) => ingredients.length === index + 1;

  const modalHeight = isDemo ? "40vh" : "auto"; // Висота модалки для демо-режиму

  return (
    <div
      className={`z-20 ${
        isDemo ? "absolute inset-x-0 bottom-0 w-full" : "fixed inset-0"
      } flex ${isDemo ? "" : "h-screen"} items-end ${
        !isDemo && "bg-black/75"
      }`}
      onClick={onClose}
    >
      <div
        className="flex h-fit w-screen flex-col gap-4 rounded-t-lg bg-dark p-8 shadow-lg shadow-dark"
        style={{
          height: modalHeight, // Встановлюємо фіксовану висоту для демо
          top: isDemo ? `calc(100vh - ${modalHeight})` : undefined, // Відступ зверху для демо
          overflowY: isDemo ? "auto" : undefined, // Прокрутка для вмісту в демо
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-white">Ingredients</h2>
        <ul className="grow list-none overflow-y-auto">
          {ingredients.map((ingredient, index) => (
            <li
              key={ingredient.id}
              className={`${
                isLastElement(index) ? "" : "border-b"
              } border-brown py-2`}
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
