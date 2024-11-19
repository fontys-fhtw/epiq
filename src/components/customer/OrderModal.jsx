"use client";

import classNames from "classnames";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

import Button from "../common/Button";
import Heading from "../common/Heading";
import IconButton from "../common/IconButton";
import Modal from "../common/Modal";

const initialValues = {
  notes: "",
};

const validationSchema = Yup.object({
  notes: Yup.string(),
});

const OrderModal = ({
  isOpen,
  onClose,
  orderItems,
  setOrderItems,
  mutateOrder,
}) => {
  if (!isOpen) return null;

  const updateOrderItem = (id, newQuantity) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeOrderItem = (id) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmitOrder = (orderDetails) => {
    mutateOrder(
      { ...orderDetails, items: orderItems },
      {
        onSuccess: () => {
          // Do nothing here, as the onSuccess is handled in RestaurantMenu
        },
        onError: (error) => {
          console.error(error.message);
          alert("Failed to process order");
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Your Order">
      <ul className="mb-4 list-none text-gray-300">
        {orderItems.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between border-b border-gray-700 py-2"
          >
            <span className="text-white">{item.name}</span>
            <div className="flex items-center space-x-2">
              <IconButton
                variant="danger"
                onClick={() => removeOrderItem(item.id)}
                aria-label={`Remove ${item.name}`}
              >
                &times;
              </IconButton>
              <IconButton
                variant="secondary"
                onClick={() => updateOrderItem(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                aria-label={`Decrease quantity of ${item.name}`}
              >
                -
              </IconButton>
              <span className="text-white">{item.quantity}</span>
              <IconButton
                variant="secondary"
                onClick={() => updateOrderItem(item.id, item.quantity + 1)}
                aria-label={`Increase quantity of ${item.name}`}
              >
                +
              </IconButton>
            </div>
          </li>
        ))}
      </ul>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitOrder}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="notes" className="block text-white">
                Notes
              </label>
              <Field
                as="textarea"
                id="notes"
                name="notes"
                className="mt-1 w-full rounded bg-gray-200 px-3 py-2 text-black focus:border-teal-500 focus:outline-none focus:ring-teal-500"
                placeholder="Add any special instructions"
              />
              <ErrorMessage
                name="notes"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !isValid || orderItems.length === 0}
              className={classNames("w-full px-4 py-2", {
                "cursor-not-allowed opacity-50": orderItems.length === 0,
              })}
            >
              Place Order
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default OrderModal;
