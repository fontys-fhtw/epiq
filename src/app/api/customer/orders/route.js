import { createSupabaseServerClient } from "@src/utils/supabase/serverClient";

export async function POST(req) {
  try {
    const { items, restaurantId, notes, userId } = await req.json();

    // Log the incoming request
    console.log("Incoming order details:", {
      items,
      restaurantId,
      notes,
      userId,
    });

    const supabase = createSupabaseServerClient();
    console.log("Supabase client created");

    // Insert the order into the 'orders' table
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        userid: userId, // Lowercase keys
        restaurantid: restaurantId, // Lowercase keys
        notes,
        statusid: 1, // Default 'submitted' status
      })
      .select("orderid") // Verwende 'orderid' in Kleinbuchstaben
      .single(); // Ensure it returns a single row

    if (orderError) {
      console.error("Order creation failed:", orderError);
      return new Response(
        JSON.stringify({ message: "Failed to create order." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const { orderid } = orderData; // Use 'orderid' in lowercase

    if (!orderid) {
      console.error("OrderId is null after order creation");
      return new Response(
        JSON.stringify({
          message: "Order creation failed: OrderId not retrieved.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Insert each item into 'order_items' table
    const orderItems = items.map((item) => ({
      orderid, // Use the retrieved 'orderid' here
      dishid: item.dishID, // Lowercase keys
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items insertion failed:", itemsError);
      return new Response(
        JSON.stringify({ message: "Failed to add order items." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Success response
    return new Response(
      JSON.stringify({
        message: "Order placed successfully!",
        orderStatus: "submitted",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error processing order:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
