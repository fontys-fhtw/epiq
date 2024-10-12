import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function OrderModal({ isOpen, onClose, orderItems, onSubmitOrder }) {
  if (!isOpen) return null;

  const initialValues = {
    customerName: "",
    customerAddress: "",
    notes: "",
  };

  const validationSchema = Yup.object({
    customerName: Yup.string().required("Name ist erforderlich"),
    customerAddress: Yup.string().required("Adresse ist erforderlich"),
    notes: Yup.string(),
  });

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-gray-900 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-3xl font-bold text-white">Ihre Bestellung</h2>
        <ul className="list-none text-gray-300 mb-4">
          {orderItems.map((item) => (
            <li key={item.dishID} className="border-b border-gray-700 py-2 flex justify-between">
              <span className="text-white">{item.dishName}</span>
              <span className="text-gray-300">x{item.quantity}</span>
            </li>
          ))}
        </ul>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            onSubmitOrder(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-white">Name</label>
                <Field
                  type="text"
                  name="customerName"
                  className="mt-1 w-full rounded px-3 py-2 text-black"
                />
                <ErrorMessage name="customerName" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-white">Adresse</label>
                <Field
                  type="text"
                  name="customerAddress"
                  className="mt-1 w-full rounded px-3 py-2 text-black"
                />
                <ErrorMessage name="customerAddress" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-white">Notizen</label>
                <Field
                  as="textarea"
                  name="notes"
                  className="mt-1 w-full rounded px-3 py-2 text-black"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Bestellung aufgeben
              </button>
            </Form>
          )}
        </Formik>

        <button
          type="button"
          className="mt-4 w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          onClick={onClose}
        >
          Schließen
        </button>
      </div>
    </div>
  );
}
