import { getOrderHistory, getRestaurantDishes } from "@src/queries/customer";
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
      // Still return hardcoded suggestions if the user has no order history for demo purposes
      return NextResponse.json({ gptSuggestedDishIds: [4, 2, 6] });
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
    return NextResponse.json({ gptSuggestedDishIds: [4, 2, 6] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
