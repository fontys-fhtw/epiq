"use client";

import {
  addTable,
  deleteTable,
  editTable,
  getTables,
} from "@src/queries/admin";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export default function TableManagement() {
  const supabase = createSupabaseBrowserClient();

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch tables on mount
  const fetchTables = async () => {
    const { data, error } = await getTables(supabase);
    if (!error) {
      setTables(data);
    } else {
      setErrorMessage(`Error fetching tables: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [supabase]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Table name is required"),
    maxPeopleAmount: Yup.number()
      .required("A valid capacity is required")
      .positive("Capacity must be a positive number")
      .integer("Capacity must be an integer"),
    location: Yup.string().required("Location is required"),
  });

  const initialValues = selectedTable
    ? {
        name: selectedTable.name,
        maxPeopleAmount: selectedTable.maxPeopleAmount,
        location: selectedTable.location,
      }
    : {
        name: "",
        maxPeopleAmount: "",
        location: "",
      };

  const handleSubmit = async (values, { resetForm }) => {
    const table = {
      name: values.name,
      maxPeopleAmount: parseInt(values.maxPeopleAmount, 10),
      location: values.location,
    };

    try {
      if (selectedTable) {
        await editTable(supabase, selectedTable.tableId, table);
      } else {
        await addTable(supabase, table);
      }
      resetForm();
      setSelectedTable(null);
      fetchTables(); // Refetch tables after adding or editing
    } catch (error) {
      setErrorMessage(`Error saving table: ${error.message}`);
    }
  };

  const handleEditClick = (table) => {
    setSelectedTable(table);
  };

  const handleDeleteClick = async (tableId) => {
    const isConfirmed = window.confirm(
      "Do you really want to delete this table?",
    );
    if (isConfirmed) {
      await deleteTable(supabase, tableId);
      fetchTables(); // Refetch after deletion
    }
  };

  return (
    <div className="h-screen w-full bg-darkBg px-4 pb-12 pt-24 text-white">
      <div className="flex h-full flex-row gap-4">
        <div className="basis-2/5 overflow-auto">
          <h2 className="mb-2 text-center text-2xl font-bold">
            Manage Restaurant Tables
          </h2>
          {errorMessage && (
            <span className="rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
              {errorMessage}
            </span>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            <Form className="rounded border bg-darkBg p-4 text-black">
              <h3 className="font-bold text-white">
                {selectedTable ? "Edit Table" : "Add New Table"}
              </h3>
              <div className="flex flex-col gap-2">
                <div>
                  <label htmlFor="name" className="text-white">
                    Table Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Table Name"
                    className="w-full rounded border p-2"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                <div>
                  <label htmlFor="maxPeopleAmount" className="text-white">
                    Capacity
                  </label>
                  <Field
                    type="number"
                    name="maxPeopleAmount"
                    placeholder="Capacity"
                    className="w-full rounded border p-2"
                  />
                  <ErrorMessage
                    name="maxPeopleAmount"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="text-white">
                    Location
                  </label>
                  <Field
                    type="text"
                    name="location"
                    placeholder="Location"
                    className="w-full rounded border p-2"
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 rounded bg-gold p-2 text-white"
                >
                  {selectedTable ? "Update Table" : "Add Table"}
                </button>
              </div>
            </Form>
          </Formik>
        </div>

        {/* List of Tables */}
        <div className="basis-3/5 overflow-auto">
          <h2 className="mb-2 text-center text-2xl font-bold">
            Current Tables
          </h2>
          {tables.map((table) => (
            <div
              key={table.tableId}
              className="mb-2 rounded border bg-darkBg p-4 text-white"
            >
              <h4 className="font-bold">{table.name}</h4>
              <p>Capacity: {table.maxPeopleAmount}</p>
              <p>Location: {table.location}</p>
              <p>Created At: {new Date(table.created_at).toLocaleString()}</p>
              {/* Edit Table */}
              <button
                className="mt-2 rounded bg-blue-500 p-2 text-white"
                onClick={() => handleEditClick(table)}
                type="button"
              >
                Edit
              </button>
              {/* Delete Table */}
              <button
                className="ml-2 mt-2 rounded bg-red-500 p-2 text-white"
                onClick={() => handleDeleteClick(table.tableId)}
                type="button"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
