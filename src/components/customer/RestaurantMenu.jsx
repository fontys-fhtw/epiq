"use client";

import mockMenuData from "@src/mock-data/mock-restaurant-menu";
import { getGPTSuggestions, getRestaurantMenu } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery as useSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useQuery as useTanstackQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import IngredientsModal from "./IngredientsModal";

const mockRestaurantId = 1;

export default function RestaurantMenu() {
  const supabase = createSupabaseBrowserClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState({});
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [gptSuggestedDishes, setGptSuggestedDishes] = useState([]);

  // const { data: menuData } = useSupabaseQuery(getRestaurantMenu(supabase));

  const { data: gptSuggestedData } = useTanstackQuery({
    queryKey: ["suggestions", mockRestaurantId],
    queryFn: () => getGPTSuggestions(mockRestaurantId),
  });

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

  const getGptSuggestedDishes = useCallback(
    () =>
      mockMenuData.reduce((acc, { dishes }) => {
        dishes.forEach((dish) => {
          if (gptSuggestedData.gptSuggestedDishIds.includes(dish.dishID)) {
            acc.push(dish);
          }
        });
        return acc;
      }, []),
    [gptSuggestedData, mockMenuData],
  );

  useEffect(() => {
    if (gptSuggestedData && mockMenuData) {
      setGptSuggestedDishes(getGptSuggestedDishes());
    }
  }, [mockMenuData, gptSuggestedData]);

  return (
    <div className="flex flex-col justify-around gap-4">
      <div>
        <h2 className="mb-4 border-b border-blue-500 pb-2 text-2xl font-bold">
          AI Suggested Dishes
        </h2>
        <div>
          {gptSuggestedDishes.map((dish) => (
            <DishCard
              key={dish.dishID}
              dish={dish}
              openModal={openModal}
              isHighlighted
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 border-b border-blue-500 pb-2 text-2xl font-bold">
          Menu
        </h2>

        {mockMenuData.map(({ category, dishes }) => (
          <div key={category} className="mb-8">
            <div
              className="mb-2 flex cursor-pointer items-center justify-between"
              onClick={() => toggleCategory(category)}
            >
              <h2 className="text-xl font-semibold">{category}</h2>
              <span
                className={`${openCategories[category] ? "rotate-180" : ""} transition-transform duration-300`}
              >
                ▲
              </span>
            </div>

            {openCategories[category] && (
              <div>
                {dishes.map((dish) => (
                  <DishCard
                    key={dish.dishID}
                    dish={dish}
                    openModal={openModal}
                    isHighlighted={gptSuggestedData?.gptSuggestedDishIds?.includes(
                      dish.dishID,
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <IngredientsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        ingredients={selectedIngredients}
      />
    </div>
  );
}

const DishCard = ({ dish, openModal, isHighlighted }) => (
  <div
    className={`mb-6 w-full rounded-lg border ${
      isHighlighted ? "border-yellow-500" : "border-gray-300"
    } p-4 shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-xl`}
  >
    <h3 className="mb-2 text-lg font-bold">{dish.dishName}</h3>
    <p className="mb-2 text-gray-500">{dish.description}</p>
    <p className="mb-2 font-semibold text-gray-600">${dish.price.toFixed(2)}</p>

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
);
