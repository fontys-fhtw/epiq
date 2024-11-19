"use client";

import { addNewCategory } from "@src/queries/admin";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

export default function NewCategoryForm({ supabase, refetchCategories }) {
  const validationSchema = Yup.object({
    categoryName: Yup.string().required("Category name is required"),
  });

  const initialValues = {
    categoryName: "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await addNewCategory(supabase, values.categoryName);
      resetForm();
      refetchCategories();
    } catch (error) {
      console.error("Error adding new category:", error);
    }
  };

  return (
    <div className="mt-4">
      <div className="rounded border p-4">
        <h3 className="font-bold">Add New Category</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="mb-4 flex gap-2">
            <div className="flex-1">
              <Field
                type="text"
                name="categoryName"
                placeholder="New Category Name"
                className="w-full rounded border p-2"
              />
              <ErrorMessage
                name="categoryName"
                component="div"
                className="text-red-600"
              />
            </div>
            <button
              type="submit"
              className="rounded bg-green-500 p-2 text-white"
            >
              Add New Category
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
