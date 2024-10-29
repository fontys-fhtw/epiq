"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BillPage() {
  const [items] = useState([
    { name: "Classic Burger", price: 8.99, quantity: 2 },
    { name: "Fries", price: 3.99, quantity: 1 },
    { name: "Coca-Cola", price: 1.99, quantity: 3 },
    { name: "Caesar Salad", price: 5.49, quantity: 1 },
    { name: "Chicken Wings", price: 6.99, quantity: 2 },
    { name: "Pasta", price: 7.99, quantity: 1 },
    { name: "Iced Tea", price: 2.49, quantity: 2 },
    { name: "Steak", price: 14.99, quantity: 1 },
    { name: "Pizza", price: 11.99, quantity: 2 },
    { name: "Milkshake", price: 4.99, quantity: 1 },
  ]);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  const calculateGrandTotal = () => {
    return items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handlePayment = () => {
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      router.push("/customer/profile");
    }, 3000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 px-4 text-white">
      {/* Header text with additional top padding */}
      <header className="mb-12 pt-20 text-center">
        <h1 className="bg-gradient-to-r from-blue-400 to-teal-600 bg-clip-text text-5xl font-extrabold text-transparent md:text-6xl">
          Your Order Summary
        </h1>
      </header>

      <main className="w-full max-w-4xl space-y-6 rounded-2xl bg-gray-900 p-8 shadow-lg">
        {/* Order Table */}
        <div className="max-h-96 overflow-auto">
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-800">
              <tr>
                <th className="w-3/4 p-4 text-xs font-semibold sm:text-sm md:px-6 md:text-lg">
                  Item
                </th>
                <th className="w-1/8 p-4 text-xs font-semibold sm:text-sm md:px-6 md:text-lg">
                  Quantity
                </th>
                <th className="w-1/8 p-4 text-xs font-semibold sm:text-sm md:px-6 md:text-lg">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={`${item.name}-${item.quantity}`}
                  className="border-b border-gray-700 transition hover:bg-gray-800"
                >
                  <td className="p-4 text-xs sm:text-sm md:px-6 md:text-lg">
                    {item.name}
                  </td>
                  <td className="p-4 text-xs sm:text-sm md:px-6 md:text-lg">
                    {item.quantity}
                  </td>
                  <td className="p-4 text-xs sm:text-sm md:px-6 md:text-lg">
                    ${item.price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Amount */}
        <div className="flex items-center justify-between rounded-lg bg-gray-800 p-4 text-lg font-bold">
          <span>Total Amount</span>
          <span className="text-2xl font-extrabold">
            ${calculateGrandTotal()}
          </span>
        </div>

        {/* Pay Button */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handlePayment}
            className="relative inline-block rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 px-10 py-5 text-lg font-bold text-white shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-600"
          >
            <span className="absolute inset-0 size-full rounded-lg bg-gradient-to-r from-blue-400 to-teal-600 opacity-10" />
            Pay Now
          </button>
        </div>
      </main>

      {/* Payment Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative rounded-lg bg-transparent px-8 py-6 text-center shadow-xl">
            <h2 className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-3xl font-bold text-transparent">
              Payment Successful!
            </h2>
            <p className="mt-2 text-lg text-gray-300">
              Thank you for your purchase.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
