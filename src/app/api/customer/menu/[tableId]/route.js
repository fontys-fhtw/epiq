export async function GET(req, { params }) {
  const { tableId } = params;

  // Beispiel-Menü-Daten
  const menus = {
    1: [
      { id: 1, name: "Pizza Margherita", price: 10 },
      { id: 2, name: "Spaghetti Carbonara", price: 12 },
    ],
    2: [
      { id: 1, name: "Caesar Salad", price: 8 },
      { id: 2, name: "Grilled Chicken", price: 14 },
    ],
  };

  const menu = menus[tableId];

  if (!menu) {
    return new Response(JSON.stringify({ error: "Menu not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(menu), {
    status: 200,
  });
}
