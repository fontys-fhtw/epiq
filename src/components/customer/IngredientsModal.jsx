import ActionButton from "../common/ActionButton";

export default function IngredientsModal({
  isOpen,
  onClose,
  ingredients,
  isDemo = false,
}) {
  if (!isOpen) return null;

  const isLastElement = (index) => ingredients.length === index + 1;

  return (
    <div
      className={`z-20 fixed inset-0 ${
        isDemo ? "flex items-start justify-center" : "flex items-end"
      } ${!isDemo && "bg-black/75"}`}
      onClick={onClose}
    >
      <div
        className={`flex flex-col gap-4 bg-dark p-4 shadow-lg shadow-dark ${
          isDemo ? "mt-[390px] w-[378px] rounded-[30px]" : "w-full rounded-t-lg"
        }`}
        style={{
          height: isDemo ? "348px" : "auto", // Висота 350px для демо
          overflowY: isDemo ? "auto" : "hidden", // Прокрутка для демо-режиму
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-white">Ingredients</h2>
        <ul
          className={`grow list-none ${
            !isDemo ? "overflow-y-auto" : "overflow-hidden"
          }`}
        >
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
