"use client";

import { addNewIngredient } from "@src/queries/admin";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

export default function NewIngredientForm({ supabase, refetchIngredients }) {
  const validationSchema = Yup.object({
    ingredientName: Yup.string().required("Ingredient name is required"),
  });

  const initialValues = {
    ingredientName: "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await addNewIngredient(supabase, values.ingredientName);
      resetForm();
      refetchIngredients();
    } catch (error) {
      console.error("Error adding new ingredient:", error);
    }
  };

  return (
    <div className="mt-4">
      <div className="rounded border p-4">
        <h3 className="font-bold text-white">Add New Ingredient</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="mb-4 flex gap-2 text-black">
            <div className="flex-1">
              <Field
                type="text"
                name="ingredientName"
                placeholder="New Ingredient Name"
                className="w-full rounded border p-2"
              />
              <ErrorMessage
                name="ingredientName"
                component="div"
                className="text-red-600"
              />
            </div>
            <button type="submit" className="rounded bg-gold p-2 text-white">
              Add New Ingredient
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
