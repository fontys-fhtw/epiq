"use client";

import { getGPTSuggestions, getRestaurantMenu } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery as useSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useQuery as useTanstackQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import IngredientsModal from "./IngredientsModal";
import OrderModal from "./OrderModal";

export default function RestaurantMenu() {
  const supabase = createSupabaseBrowserClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState({});
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [gptSuggestedDishes, setGptSuggestedDishes] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const { data: menuData } = useSupabaseQuery(getRestaurantMenu(supabase));

  const { data: gptSuggestedData } = useTanstackQuery({
    queryKey: ["suggestions"],
    queryFn: () => getGPTSuggestions(),
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
      menuData?.reduce((acc, { dishes }) => {
        dishes.forEach((dish) => {
          if (gptSuggestedData?.gptSuggestedDishIds.includes(dish.id)) {
            acc.push(dish);
          }
        });
        return acc;
      }, []),
    [menuData, gptSuggestedData],
  );

  useEffect(() => {
    if (gptSuggestedData && menuData) {
      const newSuggestedDishes = getGptSuggestedDishes();
      setGptSuggestedDishes(newSuggestedDishes);
    }
  }, [getGptSuggestedDishes, menuData, gptSuggestedData]);

  const addToOrder = (dish) => {
    const updatedDish = { ...dish, dishID: 2 };

    setOrderItems((prev) => {
      const existingItem = prev.find(
        (item) => item.dishID === updatedDish.dishID,
      );
      if (existingItem) {
        return prev.map((item) =>
          item.dishID === updatedDish.dishID
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...updatedDish, quantity: 1 }];
    });
  };

  const updateOrderItem = (dishID, newQuantity) => {
    if (newQuantity < 1) return;
    setOrderItems((prev) =>
      prev.map((item) =>
        item.dishID === dishID ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeOrderItem = (dishID) => {
    setOrderItems((prev) => prev.filter((item) => item.dishID !== dishID));
  };

  const openOrderModal = () => setIsOrderModalOpen(true);
  const closeOrderModal = () => setIsOrderModalOpen(false);

  const handleSubmitOrder = async (orderDetails) => {
    try {
      // Get authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("You must be logged in to place an order");
        return;
      }

      // Post order details to API
      const response = await axios.post("/api/customer/orders", {
        ...orderDetails,
        items: orderItems,
        restaurantId: mockRestaurantId,
        userId: user.id, // Google authenticated user's ID
      });

      if (response.data && response.data.orderStatus) {
        setOrderStatus(response.data.orderStatus); // Set the initial status
      }

      setOrderItems([]);
      closeOrderModal();
      alert("Order successful!");
    } catch (error) {
      console.error("Order submission failed:", error);
      // Handle Axios error properly
      if (error.response && error.response.status === 500) {
        alert("Internal Server Error. Please try again later.");
      } else {
        alert("Error submitting order. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col justify-around gap-4">
      <div>
        <h2 className="mb-4 border-b border-blue-500 pb-2 text-2xl font-bold">
          AI Suggested Dishes
        </h2>
        <div>
          {gptSuggestedDishes?.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              openModal={openModal}
              addToOrder={addToOrder}
              isHighlighted
              isModalOpen={isModalOpen}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 border-b border-blue-500 pb-2 text-2xl font-bold">
          Menu
        </h2>

        {menuData?.map(({ category, dishes }) => (
          <div key={category} className="mb-8">
            <div
              className="mb-2 flex cursor-pointer items-center justify-between"
              onClick={() => toggleCategory(category)}
            >
              <h2 className="text-xl font-semibold">{category}</h2>
              <span
                className={`${
                  openCategories[category] ? "rotate-180" : ""
                } transition-transform duration-300`}
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
                    addToOrder={addToOrder}
                    isHighlighted={gptSuggestedData?.gptSuggestedDishIds?.includes(
                      dish.dishID,
                    )}
                    isModalOpen={isModalOpen}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Order Status Section */}
      {orderStatus && (
        <div className="fixed bottom-20 right-4 rounded-lg bg-blue-100 px-4 py-2 text-blue-700">
          Current Order Status: <strong>{orderStatus}</strong>
        </div>
      )}

      {/* "View Order" Button */}
      <div className="fixed bottom-4 right-4">
        <button
          type="button"
          className={`rounded bg-purple-500 px-6 py-3 text-white shadow-lg hover:bg-purple-600 ${
            orderItems.length === 0 ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={openOrderModal}
          disabled={orderItems.length === 0}
        >
          View Order ({orderItems.length})
        </button>
      </div>

      {/* Modals */}
      <IngredientsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        ingredients={selectedIngredients}
      />
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={closeOrderModal}
        orderItems={orderItems}
        onSubmitOrder={handleSubmitOrder}
        updateOrderItem={updateOrderItem}
        removeOrderItem={removeOrderItem}
      />
    </div>
  );
}

const DishCard = ({
  dish,
  openModal,
  addToOrder,
  isHighlighted,
  isModalOpen,
}) => (
  <div
    className={`mb-6 w-full rounded-lg border ${
      isHighlighted ? "border-yellow-500" : "border-gray-300"
    } p-4 shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-xl`}
  >
    <h3 className="mb-2 text-lg font-bold">{dish.dishName}</h3>
    <p className="mb-2 text-gray-500">{dish.description}</p>
    <p className="mb-2 font-semibold text-gray-600">${dish.price.toFixed(2)}</p>

    <div className="mt-4 flex space-x-2">
      <button
        type="button"
        className="flex-1 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={(e) => {
          e.stopPropagation();
          openModal(dish.ingredients);
        }}
      >
        View Ingredients
      </button>
      <button
        type="button"
        className={`flex-1 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 ${
          isModalOpen ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          addToOrder(dish);
        }}
        disabled={isModalOpen}
      >
        Add to Order
      </button>
    </div>
  </div>
);
