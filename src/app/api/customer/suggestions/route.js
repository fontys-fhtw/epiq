import {
  getMostPopularDishes,
  getOrderHistory,
  getRestaurantDishes,
} from "@src/queries/customer";
// import { generateSuggestions } from "@src/utils/openai";
import { createSupabaseServerClient } from "@src/utils/supabase/serverClient";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = createSupabaseServerClient();
    const { data: menuDishes } = await getRestaurantDishes(supabase);

    const {
      data: {
        user: { id },
      },
    } = await supabase.auth.getUser();

    const orderHistory = await getOrderHistory(supabase, id);
    if (!orderHistory || orderHistory.length === 0) {
      const mostPopularDishes = await getMostPopularDishes(supabase);

      return NextResponse.json({ gptSuggestedDishIds: mostPopularDishes });
    }

    // const gptSuggestedDishIds = await generateSuggestions(
    //   orderHistory,
    //   menuDishes,
    // );

    /**
     * Avoid calling the OpenAI API for now and return hardcoded
     *
     * Rusli has verified that the OpenAI API is working as expected
     */
    return NextResponse.json({ gptSuggestedDishIds: [1, 3, 5] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
