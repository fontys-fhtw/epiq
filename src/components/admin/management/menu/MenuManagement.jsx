"use client";

import {
  getAvailableIngredients,
  getRestaurantCategories,
  getRestaurantMenu,
} from "@src/queries/admin";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useEffect, useState } from "react";

import DishForm from "./DishForm";
import DishList from "./DishList";
import NewCategoryForm from "./NewCategoryForm";
import NewIngredientForm from "./NewIngredientForm";

export default function MenuManagement() {
  const supabase = createSupabaseBrowserClient();

  const [categories, setCategories] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);

  useEffect(() => {
    // Fetch categories, ingredients, and menu data when component mounts
    const fetchData = async () => {
      try {
        const [
          { data: categoriesData },
          { data: ingredientsData },
          { data: menuResponseData },
        ] = await Promise.all([
          getRestaurantCategories(supabase),
          getAvailableIngredients(supabase),
          getRestaurantMenu(supabase),
        ]);

        setCategories(categoriesData);
        setAvailableIngredients(ingredientsData);
        setMenuData(menuResponseData);
      } catch (error) {
        setErrorMessage("Error fetching data");
        console.error(error);
      }
    };

    fetchData();
  }, [supabase]);

  // Refetch functions to update data after operations
  const refetchMenu = async () => {
    const { data } = await getRestaurantMenu(supabase);
    setMenuData(data);
  };

  const refetchIngredients = async () => {
    const { data } = await getAvailableIngredients(supabase);
    setAvailableIngredients(data);
  };

  const refetchCategories = async () => {
    const { data } = await getRestaurantCategories(supabase);
    setCategories(data);
  };

  return (
    <div className="flex flex-row gap-4">
      <div id="menuForm" className="sticky top-0 basis-2/5">
        <h2 className="mb-2 text-center text-2xl font-bold">
          Manage Restaurant Menu
        </h2>
        {errorMessage && (
          <span className="rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            {errorMessage}
          </span>
        )}

        <DishForm
          supabase={supabase}
          categories={categories}
          availableIngredients={availableIngredients}
          refetchMenu={refetchMenu}
          selectedDish={selectedDish}
          setSelectedDish={setSelectedDish}
        />

        <NewIngredientForm
          supabase={supabase}
          refetchIngredients={refetchIngredients}
        />

        <NewCategoryForm
          supabase={supabase}
          refetchCategories={refetchCategories}
        />
      </div>

      <div className="basis-3/5">
        <h2 className="text-center text-2xl font-bold">Current Menu</h2>
        <DishList
          menuData={menuData}
          supabase={supabase}
          refetchMenu={refetchMenu}
          handleEditClick={(dish) => {
            setSelectedDish(dish);
            document.getElementById("menuForm").scrollIntoView({
              behavior: "smooth",
            });
          }}
        />
      </div>
    </div>
  );
}
