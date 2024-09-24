// Admin.test.js
import "@testing-library/jest-dom";

import Admin from "@src/components/admin/Admin";
import { useQuery } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

// Mock the useQuery function
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

// Sample mock data for orders and reservations
const mockOrders = [{ id: 1, item: "Pizza" }];
const mockReservations = [{ id: 1, name: "John Doe" }];

describe("Admin component", () => {
  beforeEach(() => {
    // Reset mock before each test
    useQuery.mockReset();
  });

  test("displays orders and reservations data", () => {
    // Mock return values for useQuery
    useQuery.mockImplementation((args) => {
      if (args.queryKey[0] === "orders") {
        return { data: mockOrders };
      }
      if (args.queryKey[0] === "reservations") {
        return { data: mockReservations };
      }
      return {};
    });

    render(<Admin />);

    // Check if the orders are rendered
    expect(screen.getByText(/orders/i)).toBeInTheDocument();
    expect(screen.getByText(/pizza/i)).toBeInTheDocument();

    // Check if the reservations are rendered
    expect(screen.getByText(/reservations/i)).toBeInTheDocument();
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });

  test("displays loading state when reservations data is not yet available", () => {
    // Mock return values for useQuery with isLoading true to simulate loading
    useQuery.mockImplementation((args) => {
      if (args.queryKey[0] === "orders") {
        return { data: mockOrders, isLoading: false };
      }
      if (args.queryKey[0] === "reservations") {
        return { data: undefined, isLoading: true };
      }
      return {};
    });

    render(<Admin />);

    // Check if the loading state is rendered for reservations
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
