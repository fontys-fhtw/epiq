"use client";

import mockMenuData from "@src/mock-data/mock-restaurant-menu";
import { getRestaurantMenu } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useEffect, useState } from "react";

import IngredientsModal from "./IngredientsModal";

export default function RestaurantMenu() {
  const supabase = createSupabaseBrowserClient();
  const {
    data: menuData,
    isPending,
    isError,
    error,
  } = useQuery(getRestaurantMenu(supabase));

  const [openCategories, setOpenCategories] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category], // Toggle the visibility
    }));
  };

  const openModal = (ingredients) => {
    setSelectedIngredients(ingredients);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (mockMenuData) {
      const firstCategory = mockMenuData[0].category;
      setOpenCategories({ [firstCategory]: true });
    }
  }, [mockMenuData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-center text-4xl font-bold text-white">
        Our Menu
      </h1>

      {mockMenuData.map(({ category, dishes }) => (
        <div key={category} className="mb-8">
          <div
            className="flex cursor-pointer items-center justify-between"
            onClick={() => toggleCategory(category)}
          >
            <h2 className="text-xl font-semibold">{category}</h2>
            <span
              className={`${openCategories[category] ? "rotate-180" : ""} transition-transform duration-300`}
            >
              ▲
            </span>
          </div>

          {/* Show/Hide dishes based on category visibility */}
          {openCategories[category] && (
            <div>
              {dishes.map((dish) => (
                <div
                  key={dish.dishID}
                  className="mb-6 w-full rounded-lg border p-4 shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-xl"
                >
                  <h3 className="mb-2 text-lg font-bold">{dish.dishName}</h3>
                  <p className="mb-2 text-gray-500">{dish.description}</p>
                  <p className="mb-2 font-semibold text-gray-600">
                    ${dish.price.toFixed(2)}
                  </p>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(dish.ingredients);
                      }}
                    >
                      View Ingredients
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <IngredientsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        ingredients={selectedIngredients}
      />
    </div>
  );
}
