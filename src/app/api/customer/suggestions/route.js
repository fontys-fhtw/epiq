import { getRestaurantMenu } from "@src/queries/customer";
import { generateSuggestions } from "@src/utils/openai";
import { createSupabaseServerClient } from "@src/utils/supabase/serverClient";
import { NextResponse } from "next/server";

// mock a string (dish names) array with the user's order history from various restaurants
const mockOrderHistory = [
  "Fish Tacos", // not in the restaurant menu
  "Steak Frites", // not in the restaurant menu
  "Vegan Burger", // not in the restaurant menu
  "Margherita Pizza", // in the restaurant menu
  "BBQ Chicken Wings", // not in the restaurant menu
  "Chicken Alfredo", // in the restaurant menu
];

// mock an object where key is the dish ID and value is the dish name
const mockMenuDishes = {
  1: "Margherita Pizza",
  2: "Caesar Salad",
  3: "Pepperoni Pizza",
  4: "Greek Salad",
  5: "BBQ Chicken Pizza",
  6: "Chicken Alfredo",
  7: "Chicken Parmesan",
  8: "Spaghetti Carbonara",
  9: "Chicken Marsala",
  10: "Tiramisu",
  11: "Chicken Piccata",
  12: "Chicken Cacciatore",
  13: "Chicken Francese",
  14: "Chicken Saltimbocca",
};

export async function POST(req) {
  try {
    const { restaurantId } = await req.json();

    const supabase = createSupabaseServerClient();
    // const restaurantMenu = getRestaurantMenu(supabase, restaurantId);

    const {
      data: {
        user: { id },
      },
    } = await supabase.auth.getUser();
    /**
     * We can use the user ID to fetch the user's order history from the database
     * for now we will use a mock order history
     */

    const gptSuggestedDishIds = await generateSuggestions(
      mockOrderHistory,
      mockMenuDishes,
    );

    return NextResponse.json({ gptSuggestedDishIds });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
