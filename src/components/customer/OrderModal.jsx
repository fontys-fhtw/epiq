"use client";

import { ORDER_STATUS_ID } from "@src/constants";
import { getCustomerSession } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus, FaRocket, FaSpinner, FaTimes } from "react-icons/fa";
import * as Yup from "yup";

import ActionButton from "../common/ActionButton";
import IconButton from "../common/IconButton";

const initialValues = {
  notes: "",
};

const validationSchema = Yup.object({
  notes: Yup.string().max(200, "Notes must be 200 characters or less"),
});

const OrderModal = ({ orderItems, setOrderItems, tableId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const supabase = createSupabaseBrowserClient();

  const removeOrderItem = (id) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateOrderItem = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeOrderItem(id);
      return;
    }

    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const { mutate: mutateOrder, isLoading } = useMutation({
    mutationFn: async (orderDetails) => {
      const { data: userData, error: userError } =
        await getCustomerSession(supabase);
      if (userError) throw new Error("User authentication failed");

      const userId = userData?.session?.user?.id;

      // Calculate the total amount based on order items
      const totalAmount = orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          userid: userId,
          tableid: tableId,
          notes: orderDetails.notes,
          statusid: ORDER_STATUS_ID.SUBMITTED,
          total_amount: totalAmount,
        })
        .select("orderid")
        .single();

      if (orderError) throw new Error("Order creation failed");

      const { orderid } = orderData;
      const orderItemsData = orderItems.map((item) => ({
        orderid,
        dishid: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsData);

      if (itemsError) throw new Error("Order items insertion failed");

      return orderid;
    },
    onSuccess: (orderId) => {
      router.push(`/customer/order/${orderId}`);
    },
    onError: (error) => {
      console.error(error.message);
      alert("Failed to process order");
    },
  });

  const handleSubmitOrder = ({ notes }) => {
    mutateOrder({ notes, items: orderItems });
  };

  return (
    <>
      {!isOpen ? (
        <ViewOrderButton onClick={openModal} orderItems={orderItems} />
      ) : (
        <div
          className="fixed inset-0 z-20 flex items-end bg-darkBg/75"
          onClick={closeModal}
        >
          <div
            className="flex h-fit w-screen flex-col gap-4 rounded-t-lg bg-dark p-8 shadow-lg shadow-dark"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">Your Order</h2>
                {tableId ? (
                  <p className="mt-2 text-sm text-yellow-400">
                    Your table ID is{" "}
                    <span className="font-bold">{tableId}</span>.
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-yellow-400">
                    Takeaway option selected. To order on a specific table,
                    please scan the QR code on the table.
                  </p>
                )}
              </div>

              <div>
                <IconButton onClick={closeModal}>
                  <FaTimes size={30} />
                </IconButton>
              </div>
            </div>

            {/* Order Items List */}
            <ul className="list-none text-gray-300">
              {orderItems.map((item, index) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between border-b border-brown py-2"
                >
                  <span className="font-semibold text-white">{item.name}</span>
                  <div className="flex items-center space-x-2">
                    {/* Decrease Quantity Button */}
                    <IconButton
                      onClick={() =>
                        updateOrderItem(item.id, item.quantity - 1)
                      }
                      className="rounded bg-brown text-white"
                    >
                      <FaMinus size={14} />
                    </IconButton>

                    {/* Quantity Display */}
                    <span className="text-gray-200">{item.quantity}</span>

                    {/* Increase Quantity Button */}
                    <IconButton
                      onClick={() =>
                        updateOrderItem(item.id, item.quantity + 1)
                      }
                      className="rounded bg-brown text-white"
                    >
                      <FaPlus size={14} />
                    </IconButton>
                  </div>
                </li>
              ))}
            </ul>

            {/* Order Notes Form */}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmitOrder}
            >
              {() => (
                <Form className="space-y-4">
                  {/* Notes Field */}
                  <div>
                    <label className="mb-1 block text-white">Notes</label>
                    <Field
                      as="textarea"
                      name="notes"
                      className="w-full rounded bg-gray-200 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="Add any special instructions"
                    />
                    <ErrorMessage
                      name="notes"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <ActionButton
                    type="submit"
                    className={`flex w-full items-center justify-center rounded-lg text-xl ${
                      isLoading || orderItems.length === 0
                        ? "cursor-not-allowed bg-gray-400"
                        : "bg-gold hover:bg-yellow-500"
                    }`}
                    disabled={isLoading || orderItems.length === 0}
                  >
                    {isLoading ? (
                      <FaSpinner
                        className="mr-2 size-5 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <FaRocket className="mr-2 size-5" aria-hidden="true" />
                    )}
                    {isLoading ? "Placing Order..." : "Place Order"}
                  </ActionButton>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

function ViewOrderButton({ onClick, orderItems }) {
  return (
    <div className="fixed bottom-0 right-0 w-1/2 pb-8 pr-8">
      <ActionButton
        label="View Order"
        onClick={onClick}
        disabled={orderItems.length === 0}
        className={`w-full rounded-lg text-lg transition-opacity duration-300 ${
          orderItems.length === 0 ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        View Order <span className="font-semibold">({orderItems.length})</span>
      </ActionButton>
    </div>
  );
}

export default OrderModal;
