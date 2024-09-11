export async function GET() {
  const mockResponse = {
    reservations: [
      { id: 1, name: "Reservation 1" },
      { id: 2, name: "Reservation 2" },
    ],
  };

  return Response.json({
    status: 200,
    body: mockResponse,
  });
}
