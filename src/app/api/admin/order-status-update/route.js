import { createSupabaseServerClient } from "@src/utils/supabase/serverClient";

export async function PUT(req) {
  const supabase = createSupabaseServerClient();
  const { orderid, statusid } = await req.json();

  if (!orderid || !statusid) {
    return new Response(
      JSON.stringify({ error: "orderid and statusid are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const { error } = await supabase
      .from("orders")
      .update({ statusid })
      .eq("orderid", orderid)
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({ message: "Order status updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update order status" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
