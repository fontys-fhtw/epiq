"use client";

import { getGPTSuggestions, getRestaurantMenu } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery as useSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaInfoCircle, FaPlus } from "react-icons/fa";

import Button from "../common/Button";
import Heading from "../common/Heading";
import IconButton from "../common/IconButton";
import IngredientsModal from "./IngredientsModal";
import OrderModal from "./OrderModal";

const MOCK_TABLE_ID = 1;
const ORDER_STATUS = {
  SUBMITTED: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  CANCELLED: 4,
};

export default function RestaurantMenu() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState({});
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [gptSuggestedDishes, setGptSuggestedDishes] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const { data: menuData } = useSupabaseQuery(getRestaurantMenu(supabase));

  const { data: gptSuggestedData } = useTanstackQuery({
    queryKey: ["suggestions"],
    queryFn: getGPTSuggestions,
  });

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
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
    setOrderItems((prev) => {
      const existingItem = prev.find((item) => item.id === dish.id);
      if (existingItem) {
        return prev;
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const openOrderModal = () => setIsOrderModalOpen(true);
  const closeOrderModal = () => setIsOrderModalOpen(false);

  const orderMutation = useMutation({
    mutationFn: async (orderDetails) => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw new Error("User authentication failed");

      // Calculate the total amount based on order items
      const totalAmount = orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          userid: user.id,
          tableid: MOCK_TABLE_ID,
          notes: orderDetails.notes,
          statusid: ORDER_STATUS.SUBMITTED,
          total_amount: totalAmount,
        })
        .select("orderid")
        .single();

      if (orderError) throw new Error("Order creation failed");

      const { orderid } = orderData;
      const orderItemsData = orderItems.map((item) => ({
        orderid,
        dishid: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsData);

      if (itemsError) throw new Error("Order items insertion failed");

      return orderid;
    },
    onSuccess: (orderId) => {
      router.push(`/customer/bill?orderId=${orderId}`);
    },
    onError: (error) => {
      console.error(error.message);
      alert("Failed to process order");
    },
  });

  return (
    <div className="flex flex-col justify-around gap-8 p-4">
      {/* AI Suggested Dishes Section */}
      <div>
        <Heading
          level={2}
          className="mb-4 border-b border-teal-500 pb-2 text-2xl"
        >
          AI Suggested Dishes
        </Heading>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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

      {/* Menu Section */}
      <div>
        <Heading
          level={2}
          className="mb-4 border-b border-teal-500 pb-2 text-2xl"
        >
          Menu
        </Heading>

        {menuData?.map(({ category, dishes }) =>
          dishes.length ? (
            <div key={category} className="mb-8">
              <div
                className="mb-2 flex cursor-pointer items-center justify-between rounded-lg bg-gray-700 p-2"
                onClick={() => toggleCategory(category)}
              >
                <Heading level={3} className="text-xl font-semibold text-white">
                  {category}
                </Heading>
                <span
                  className={`${
                    openCategories[category] ? "rotate-180" : "rotate-0"
                  } text-white transition-transform duration-300`}
                >
                  ▲
                </span>
              </div>

              {openCategories[category] && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {dishes.map((dish) => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      openModal={openModal}
                      addToOrder={addToOrder}
                      isHighlighted={gptSuggestedData?.gptSuggestedDishIds?.includes(
                        dish.id,
                      )}
                      isModalOpen={isModalOpen}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null,
        )}
      </div>

      {/* View Order Button */}
      <div className="fixed bottom-4 right-4">
        <Button
          type="button"
          variant="success"
          onClick={openOrderModal}
          disabled={orderItems.length === 0}
          className={`px-6 py-3 shadow-lg ${
            orderItems.length === 0 ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          View Order ({orderItems.length})
        </Button>
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
        setOrderItems={setOrderItems}
        mutateOrder={orderMutation.mutate}
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
    className={classNames(
      "flex flex-col justify-between bg-gray-800 rounded-lg shadow-md p-4 transition-shadow duration-300 ease-in-out hover:shadow-xl",
      {
        "border-2 border-yellow-500": isHighlighted,
        "border border-gray-300": !isHighlighted,
      },
    )}
  >
    {/* Dish Information */}
    <div>
      {/* Dish Name */}
      <Heading level={3} className="mb-1 text-lg font-bold text-white">
        {dish.name}
      </Heading>

      {/* Dish Description */}
      <p className="mb-2 text-gray-400">{dish.description}</p>

      <div className="flex justify-between">
        {/* Dish Price */}
        <p className="mb-2 font-semibold text-gray-300">
          ${dish.price.toFixed(2)}
        </p>
        {/* View Ingredients Button */}
        <div className="flex space-x-2">
          <IconButton
            variant="secondary"
            onClick={() => openModal(dish.ingredients)}
            aria-label="View Ingredients"
            title="View Ingredients"
          >
            <FaInfoCircle size={20} />
          </IconButton>

          {/* Add to Order Button */}
          <IconButton
            variant="success"
            onClick={() => addToOrder(dish)}
            aria-label="Add to Order"
            title="Add to Order"
            disabled={isModalOpen}
            className={classNames({
              "cursor-not-allowed opacity-50": isModalOpen,
            })}
          >
            <FaPlus size={20} />
          </IconButton>
        </div>
      </div>
    </div>
  </div>
);
