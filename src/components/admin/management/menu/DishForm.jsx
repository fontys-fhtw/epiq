"use client";

import {
  addDish,
  addDishIngredients,
  deleteDishIngredient,
  editDish,
  updateDishIngredient,
} from "@src/queries/admin";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export default function DishForm({
  supabase,
  categories,
  availableIngredients,
  refetchMenu,
  selectedDish,
  setSelectedDish,
}) {
  const [existingIngredients, setExistingIngredients] = useState([]);

  useEffect(() => {
    if (selectedDish) {
      setExistingIngredients(selectedDish.ingredients);
    } else {
      setExistingIngredients([]);
    }
  }, [selectedDish]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Dish name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .required("A valid price is required")
      .positive("Price must be positive"),
    categoryId: Yup.string().required("Please select a category"),
    ingredients: Yup.array()
      .of(
        Yup.object().shape({
          ingredientId: Yup.string().required("Select an ingredient"),
          quantity: Yup.string().required("Quantity is required"),
        }),
      )
      .min(1, "Please add at least one ingredient with valid quantity"),
  });

  const initialValues = selectedDish
    ? {
        name: selectedDish.name,
        description: selectedDish.description,
        price: selectedDish.price,
        categoryId: selectedDish.categoryId,
        ingredients: selectedDish.ingredients.map((ingredient) => ({
          ingredientId: ingredient.id,
          quantity: ingredient.quantity,
        })),
      }
    : {
        name: "",
        description: "",
        price: "",
        categoryId: "",
        ingredients: [{ ingredientId: "", quantity: "" }],
      };

  const handleSubmit = async (values, { resetForm }) => {
    const dish = {
      name: values.name,
      description: values.description,
      price: parseFloat(values.price),
      categoryId: values.categoryId,
    };

    try {
      if (selectedDish) {
        await editDish(supabase, selectedDish.id, dish);

        // Determine which ingredients to add, update, or remove
        const updatedIngredientIds = values.ingredients.map(
          (ing) => ing.ingredientId,
        );

        // 1. Remove ingredients
        const ingredientsToRemove = existingIngredients.filter(
          (existingIng) => !updatedIngredientIds.includes(existingIng.id),
        );

        Promise.all(
          ingredientsToRemove.map((ingredient) =>
            deleteDishIngredient(supabase, selectedDish.id, ingredient.id),
          ),
        );

        // 2. Add new ingredients
        const newIngredients = values.ingredients.filter(
          (ing) =>
            !existingIngredients.some(
              (existingIng) => existingIng.id === ing.ingredientId,
            ),
        );
        await addDishIngredients(supabase, selectedDish.id, newIngredients);

        // 3. Update existing ingredients
        const updatedIngredients = values.ingredients.filter((ing) =>
          existingIngredients.some(
            (existingIng) =>
              existingIng.id === ing.ingredientId &&
              existingIng.quantity !== ing.quantity,
          ),
        );

        Promise.all(
          updatedIngredients.map((ingredient) =>
            updateDishIngredient(supabase, selectedDish.id, ingredient),
          ),
        );
      } else {
        const { data: newDishData } = await addDish(supabase, dish);
        await addDishIngredients(supabase, newDishData.id, values.ingredients);
      }

      await refetchMenu();
      resetForm();
      setSelectedDish(null);
      setExistingIngredients([]);
    } catch (error) {
      console.error("Error saving dish:", error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors }) => (
        <Form className="rounded border p-4">
          <h3 className="font-bold">
            {selectedDish ? "Edit Dish" : "Add New Dish"}
          </h3>

          <div className="flex flex-col gap-2">
            <div>
              <label htmlFor="name">Dish Name</label>
              <Field
                type="text"
                name="name"
                placeholder="Dish Name"
                className="w-full rounded border p-2"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-600"
              />
            </div>

            <div>
              <label htmlFor="description">Description</label>
              <Field
                type="text"
                name="description"
                placeholder="Description"
                className="w-full rounded border p-2"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-600"
              />
            </div>

            <div>
              <label htmlFor="price">Price</label>
              <Field
                type="number"
                name="price"
                placeholder="Price"
                className="w-full rounded border p-2"
              />
              <ErrorMessage
                name="price"
                component="div"
                className="text-red-600"
              />
            </div>

            <div>
              <label htmlFor="categoryId">Category</label>
              <Field
                as="select"
                name="categoryId"
                className="w-full rounded border p-2 text-black"
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="categoryId"
                component="div"
                className="text-red-600"
              />
            </div>

            {/* Ingredients List */}
            <FieldArray name="ingredients">
              {({ remove, push }) => (
                <div>
                  <h4 className="mt-2 font-bold">Ingredients</h4>
                  {values.ingredients &&
                    values.ingredients.length > 0 &&
                    values.ingredients.map((ingredient, index) => (
                      <div key={ingredient.id} className="mb-2 flex gap-2">
                        <div className="flex-1">
                          <Field
                            as="select"
                            name={`ingredients[${index}].ingredientId`}
                            className="w-full rounded border p-2 text-black"
                          >
                            <option value="" disabled>
                              Select Ingredient
                            </option>
                            {availableIngredients.map((ing) => (
                              <option key={ing.id} value={ing.id}>
                                {ing.ingredientName}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name={`ingredients[${index}].ingredientId`}
                            component="div"
                            className="text-red-600"
                          />
                        </div>

                        <div className="flex-1">
                          <Field
                            type="text"
                            name={`ingredients[${index}].quantity`}
                            placeholder="Quantity"
                            className="w-full rounded border p-2"
                          />
                          <ErrorMessage
                            name={`ingredients[${index}].quantity`}
                            component="div"
                            className="text-red-600"
                          />
                        </div>

                        <button
                          type="button"
                          className="rounded bg-red-500 p-2 text-white"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  <button
                    type="button"
                    className="rounded bg-blue-500 p-2 text-white"
                    onClick={() => push({ ingredientId: "", quantity: "" })}
                  >
                    Add Ingredient
                  </button>
                  {typeof errors.ingredients === "string" && (
                    <div className="text-red-600">{errors.ingredients}</div>
                  )}
                </div>
              )}
            </FieldArray>

            <button
              type="submit"
              className="rounded bg-green-500 p-2 text-white"
            >
              {selectedDish ? "Update Dish" : "Add Dish"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
