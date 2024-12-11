import { createSupabaseServerClient } from "@src/utils/supabase/serverClient";

export async function GET() {
  const supabase = createSupabaseServerClient();

  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        orderid,
        tableid,
        notes,
        created_at,
        orderStatusId:statusid,
        order_items (
          quantity,
          price,
          dish:"restaurant-menu" ( id, name )
        )
      `,
      )
      .order("orderid", { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(orders), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
