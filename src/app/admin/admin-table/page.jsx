"use client";

import {
  addTable,
  deleteTable,
  editTable,
  getTables,
} from "@src/queries/admin";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Table name is required"),
  maxPeopleAmount: Yup.number()
    .required("A valid capacity is required")
    .positive("Capacity must be a positive number")
    .integer("Capacity must be an integer"),
  location: Yup.string().required("Location is required"),
});

export default function AdminTableManagement() {
  const supabase = createSupabaseBrowserClient();

  const [tables, setTables] = useState([]);
  const [editingTableId, setEditingTableId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch tables on mount
  const fetchTables = async () => {
    const { data, error } = await getTables(supabase);
    if (!error) {
      setTables(data);
      console.log("Fetched tables:", data);
    } else {
      setErrorMessage("Error fetching tables: ", error.message);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [supabase]);

  const formik = useFormik({
    initialValues: {
      name: "",
      maxPeopleAmount: "",
      location: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const table = {
        name: values.name,
        maxPeopleAmount: parseInt(values.maxPeopleAmount, 10),
        location: values.location,
      };

      try {
        if (editingTableId) {
          await editTable(supabase, editingTableId, table);
        } else {
          await addTable(supabase, table);
        }
        // eslint-disable-next-line no-use-before-define
        resetForm();
        fetchTables(); // Refetch tables after adding or editing
      } catch (error) {
        setErrorMessage("Error saving table: ", error.message);
      }
    },
  });

  const resetForm = () => {
    formik.resetForm();
    setEditingTableId(null);
  };

  const handleEditClick = (table) => {
    formik.setValues({
      name: table.name,
      maxPeopleAmount: String(table.maxPeopleAmount), // Convert number to string for controlled input
      location: table.location,
    });
    setEditingTableId(table.tableId);
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
    <div className="flex flex-row gap-4">
      <div className="basis-1/4">
        <h2 className="mb-2 text-center text-2xl font-bold">
          Manage Restaurant Tables
        </h2>
        {errorMessage && (
          <span className="me-2 ml-2 rounded-t bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            {errorMessage}
          </span>
        )}
        {/* Add/Edit Table Form */}
        <form className="rounded border p-4" onSubmit={formik.handleSubmit}>
          <h3 className="font-bold">
            {editingTableId ? "Edit Table" : "Add New Table"}
          </h3>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Table Name"
              className="rounded border bg-gray-200 p-2 text-black"
            />
            {formik.touched.name && formik.errors.name ? (
              <span className="text-red-600">{formik.errors.name}</span>
            ) : null}
            <input
              type="number"
              name="maxPeopleAmount"
              value={formik.values.maxPeopleAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Capacity"
              className="rounded border bg-gray-200 p-2 text-black"
            />
            {formik.touched.maxPeopleAmount && formik.errors.maxPeopleAmount ? (
              <span className="text-red-600">
                {formik.errors.maxPeopleAmount}
              </span>
            ) : null}
            <input
              type="text"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Location"
              className="rounded border bg-gray-200 p-2 text-black"
            />
            {formik.touched.location && formik.errors.location ? (
              <span className="text-red-600">{formik.errors.location}</span>
            ) : null}
            <button
              type="submit"
              className="rounded bg-green-500 p-2 text-white"
            >
              {editingTableId ? "Update Table" : "Add Table"}
            </button>
          </div>
        </form>
      </div>

      {/* List of Tables */}
      <div className="basis-3/4">
        <h2 className="text-center text-2xl font-bold">Current Tables</h2>
        {tables.map((table) => (
          <div key={table.tableId} className="mb-2 rounded border p-4">
            <h4 className="font-bold">{table.name}</h4>
            <p>Capacity: {table.maxPeopleAmount}</p>
            <p>Location: {table.location}</p>
            <p>Created At: {table.createdAt}</p>
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
  );
}
