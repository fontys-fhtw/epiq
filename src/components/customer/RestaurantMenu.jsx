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
    <div className="flex flex-col gap-12 pb-12 pt-6">
      <div>
        <TitleWithBottomBorder>Suggested Dishes</TitleWithBottomBorder>
        <CardsContainer>
          {gptSuggestedDishes?.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              openModal={openModal}
              addToOrder={addToOrder}
              isHighlighted
            />
          ))}
        </CardsContainer>
      </div>

      <div>
        <TitleWithBottomBorder>Menu</TitleWithBottomBorder>

        <div>
          {menuData?.map(({ category, dishes }) =>
            dishes.length ? (
              <div key={category} className="mb-8">
                <div
                  className="mb-2 flex cursor-pointer items-center justify-between text-white"
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
                  <CardsContainer>
                    {dishes.map((dish) => (
                      <DishCard
                        key={dish.id}
                        dish={dish}
                        openModal={openModal}
                        addToOrder={addToOrder}
                        isHighlighted={gptSuggestedData?.gptSuggestedDishIds?.includes(
                          dish.id,
                        )}
                      />
                    ))}
                  </CardsContainer>
                )}
              </div>
            ) : null,
          )}
        </div>
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

function CardsContainer({ children }) {
  return <div className="grid grid-cols-1 gap-4">{children}</div>;
}

function TitleWithBottomBorder({ children }) {
  return (
    <h2 className="mb-4 border-b border-dark pb-2 text-2xl font-bold text-white">
      {children}
    </h2>
  );
}

const DishCard = ({ dish, openModal, addToOrder, isHighlighted }) => (
  <div
    className={`w-full rounded-lg border ${
      isHighlighted ? "border-gold" : "border-dark"
    } p-4`}
  >
    <div className="flex justify-between gap-4">
      <div>
        <h3 className="mb-1 text-lg font-bold text-white">{dish.name}</h3>
        <p className="mb-1 text-gray-300">{dish.description}</p>
        <p className="mb-1 font-semibold text-gray-400">
          ${dish.price.toFixed(2)}
        </p>
      </div>
      <div className="flex shrink-0 flex-col justify-center space-y-2">
        <CardIconButton
          onClick={(e) => {
            e.stopPropagation();
            openModal(dish.ingredients);
          }}
          className="text-blue-500"
        >
          <FaInfoCircle size={20} />
        </CardIconButton>
        <CardIconButton
          onClick={(e) => {
            e.stopPropagation();
            addToOrder(dish);
          }}
          className="text-green-500"
        >
          <FaPlus size={20} />
        </CardIconButton>
      </div>
    </div>
  </div>
);

function CardIconButton({ children, onClick, className }) {
  return (
    <button
      type="button"
      className={`rounded bg-transparent p-1 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
