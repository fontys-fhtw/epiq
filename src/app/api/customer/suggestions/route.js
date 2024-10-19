import { getRestaurantDishes } from "@src/queries/customer";
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

export async function POST() {
  try {
    const supabase = createSupabaseServerClient();
    const { data: menuDishes } = await getRestaurantDishes(supabase);

    const {
      data: {
        user: { id },
      },
    } = await supabase.auth.getUser();
    /**
     * We can use the user ID to fetch the user's order history from the database
     * for now we will use a mock order history
     */

    // const gptSuggestedDishIds = await generateSuggestions(
    //   mockOrderHistory,
    //   menuDishes,
    // );

    return NextResponse.json({ gptSuggestedDishIds: [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
