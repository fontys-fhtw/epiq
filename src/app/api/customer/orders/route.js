export async function POST(req, res) {
  try {
    const { items, restaurantId, notes } = await req.json();

    // Einfache Validierung der empfangenen Daten
    if (
      !restaurantId ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return new Response(
        JSON.stringify({ message: "Ungültige Bestelldaten." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Optional: Weitere Validierungen für jedes Bestellitem
    // eslint-disable-next-line no-restricted-syntax
    for (const item of items) {
      if (!item.dishID || !item.quantity) {
        return new Response(
          JSON.stringify({ message: "Ungültige Daten in Bestellpositionen." }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    // Simuliere die Bestellverarbeitung (z.B. Logging)
    console.log("Bestellung empfangen:", {
      restaurantId,
      items,
      notes,
    });

    // Sende eine erfolgreiche Antwort zurück
    return new Response(
      JSON.stringify({ message: "Bestellung erfolgreich aufgegeben!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Fehler beim Verarbeiten der Bestellung:", error);
    return new Response(JSON.stringify({ message: "Interner Serverfehler." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Optionale Unterstützung für andere HTTP-Methoden
export function GET(req, res) {
  return new Response(
    JSON.stringify({ message: "Methode GET nicht unterstützt." }),
    {
      status: 405,
      headers: { "Content-Type": "application/json" },
    },
  );
}
