import PropTypes from "prop-types";
import React from "react";

import Button from "../common/Button";
import Card from "../common/Card";
import Heading from "../common/Heading";

const IngredientsModal = ({ isOpen, onClose, ingredients }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-lg rounded-t-lg bg-gray-900 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Heading level={2} className="mb-4 text-3xl">
          Ingredients
        </Heading>
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
        <Button
          type="button"
          variant="danger"
          onClick={onClose}
          className="mt-6 w-full"
        >
          Close
        </Button>
      </Card>
    </div>
  );
};

IngredientsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      details: PropTypes.shape({
        ingredientName: PropTypes.string.isRequired,
      }),
    }),
  ).isRequired,
};

export default IngredientsModal;
