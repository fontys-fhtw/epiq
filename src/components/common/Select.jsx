// components/common/Select.js

import classNames from "classnames";
import { ErrorMessage, Field } from "formik";
import PropTypes from "prop-types";
import React from "react";

const Select = ({ label, name, options, placeholder, className, ...props }) => {
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
        as="select"
        id={name}
        name={name}
        className={classNames(
          "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500",
          className,
        )}
        {...props}
      >
        <option value="" disabled>
          {placeholder || "Select an option"}
        </option>
        {options.map((option) => (
          <option
            key={option.value || option.id}
            value={option.value || option.id}
          >
            {option.label || option.name}
          </option>
        ))}
      </Field>
      <ErrorMessage
        name={name}
        component="div"
        className="mt-1 text-sm text-red-600"
      />
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default Select;
