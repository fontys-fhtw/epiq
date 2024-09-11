export async function GET() {
  const mockResponse = {
    orders: [
      { id: 1, name: "Order 1" },
      { id: 2, name: "Order 2" },
    ],
  };

  return Response.json({
    status: 200,
    body: mockResponse,
  });
}
