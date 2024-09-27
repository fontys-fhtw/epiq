// import { getRestaurantMenu } from "@src/queries/customer";
// import { generateSuggestions } from "@src/utils/openai";
import { createSupabaseServerClient } from "@src/utils/supabase/serverClient";
import { NextResponse } from "next/server";

// This should be fetched from the database
// const mockOrderHistory = [
//   {
//     orderId: 1,
//     restaurant: "Pizzeria Bella",
//     dish: "Margherita Pizza",
//     date: "2024-09-01",
//     price: 9.99,
//   },
//   {
//     orderId: 2,
//     restaurant: "La Pasta House",
//     dish: "Spaghetti Carbonara",
//     date: "2024-09-03",
//     price: 12.5,
//   },
//   {
//     orderId: 3,
//     restaurant: "Healthy Bites",
//     dish: "Caesar Salad",
//     date: "2024-09-10",
//     price: 7.0,
//   },
//   {
//     orderId: 4,
//     restaurant: "Pizzeria Bella",
//     dish: "Pepperoni Pizza",
//     date: "2024-09-15",
//     price: 10.99,
//   },
// ];

export async function POST(req) {
  try {
    console.info(req);
    // const { restaurantId } = await req.json();

    const supabase = createSupabaseServerClient();
    // const restaurantMenu = getRestaurantMenu(supabase, restaurantId);

    const {
      data: {
        user: { id },
      },
    } = await supabase.auth.getUser();
    console.info("Generating suggestions for user ID:", id);
    /**
     * We can use the user ID to fetch the user's order history from the database
     * for now we will use a mock order history
     */

    // const gptSuggestions = generateSuggestions(restaurantMenu, mockOrderHistory);
    const gptSuggestions = "This is a mock suggestion";

    return NextResponse.json(gptSuggestions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
