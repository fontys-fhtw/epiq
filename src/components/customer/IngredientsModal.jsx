"use client";

import { memo } from "react";

import ActionButton from "../common/ActionButton";

const IngredientsModal = memo(function IngredientsModal({
  isOpen,
  onClose,
  ingredients,
  isDemo = false,
}) {
  const isLastElement = (index) => ingredients.length === index + 1;

  return (
    <div
      className={`fixed inset-0 z-20 flex ${
        isDemo ? "items-start justify-center" : "items-end"
      } bg-black/75 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`flex flex-col gap-4 bg-dark p-8 shadow-lg shadow-dark transition-transform duration-300 ${
          isDemo
            ? "h-88 mt-40 w-96 overflow-auto rounded-2xl"
            : "w-full rounded-t-lg"
        } ${isOpen ? "translate-y-0" : "translate-y-full"}`}
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
});

export default IngredientsModal;
