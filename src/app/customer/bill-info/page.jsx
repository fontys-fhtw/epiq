"use client";

import { useState } from "react";

export default function BillPage() {
  const [items] = useState([
    { name: "Classic Burger", price: 8.99, quantity: 2 },
    { name: "Fries", price: 3.99, quantity: 1 },
    { name: "Coca-Cola", price: 1.99, quantity: 3 },
    { name: "Caesar Salad", price: 5.49, quantity: 1 },
  ]);

  const calculateItemTotal = (item) => {
    return (item.price * item.quantity).toFixed(2);
  };

  const calculateGrandTotal = () => {
    return items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 py-12 text-white">
      <h1 className="mb-8 text-5xl font-bold">Your Order Summary</h1>

      <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-gray-800 shadow-lg">
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-lg font-semibold">Item</th>
              <th className="px-6 py-4 text-lg font-semibold">Quantity</th>
              <th className="px-6 py-4 text-lg font-semibold">Price</th>
              <th className="px-6 py-4 text-lg font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={`${item.name}-${item.quantity}`}
                className="border-b border-gray-600"
              >
                <td className="px-6 py-4 text-lg">{item.name}</td>
                <td className="px-6 py-4 text-lg">{item.quantity}</td>
                <td className="px-6 py-4 text-lg">${item.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-lg font-semibold">
                  ${calculateItemTotal(item)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 w-full max-w-4xl rounded-lg bg-gray-800 p-6 text-center shadow-lg">
        <h2 className="text-3xl font-bold text-gray-200">Total Amount</h2>
        <p className="mt-4 text-4xl font-extrabold text-white">
          ${calculateGrandTotal()}
        </p>
      </div>
    </div>
  );
}
