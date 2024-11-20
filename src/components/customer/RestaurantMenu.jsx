"use client";

import { getGPTSuggestions, getRestaurantMenu } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useQuery as useSupabaseQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaInfoCircle, FaPlus } from "react-icons/fa";

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

        {menuData?.map(({ category, dishes }) =>
          dishes.length ? (
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
    className={`mb-6 w-full rounded-lg border ${
      isHighlighted ? "border-yellow-500" : "border-gray-300"
    } p-4 shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-xl`}
  >
    <div className="flex justify-between">
      <div>
        <h3 className="mb-1 text-lg font-bold">{dish.name}</h3>
        <p className="mb-1 text-gray-500">{dish.description}</p>
        <p className="mb-1 font-semibold text-gray-600">
          ${dish.price.toFixed(2)}
        </p>
      </div>
      <div className="ml-4 mt-5 flex shrink-0 flex-col space-y-2">
        <button
          type="button"
          className="rounded bg-transparent p-1 text-blue-500 hover:text-blue-600"
          onClick={(e) => {
            e.stopPropagation();
            openModal(dish.ingredients);
          }}
          aria-label="View Ingredients"
          title="View Ingredients"
        >
          <FaInfoCircle size={20} />
        </button>
        <button
          type="button"
          className={`rounded bg-transparent p-1 text-green-500 hover:text-green-600 ${
            isModalOpen ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            addToOrder(dish);
          }}
          disabled={isModalOpen}
          aria-label="Add to Order"
          title="Add to Order"
        >
          <FaPlus size={20} />
        </button>
      </div>
    </div>
  </div>
);
