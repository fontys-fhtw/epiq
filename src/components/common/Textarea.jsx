// components/common/Textarea.js

import classNames from "classnames";
import { ErrorMessage, Field } from "formik";
import PropTypes from "prop-types";
import React from "react";

const Textarea = ({ label, name, placeholder, className, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-charcoal"
        >
          {label}
        </label>
      )}
      <Field
        as="textarea"
        id={name}
        name={name}
        placeholder={placeholder}
        className={classNames(
          "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500",
          className,
        )}
        {...props}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="mt-1 text-sm text-red-600"
      />
    </div>
  );
};

Textarea.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default Textarea;
