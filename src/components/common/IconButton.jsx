// components/common/IconButton.js

import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

const IconButton = ({
  children,
  onClick,
  variant = "primary",
  className,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition";

  const variantStyles = {
    primary: "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500",
    secondary:
      "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500",
    danger:
      "bg-crimson-500 text-white hover:bg-crimson-600 focus:ring-crimson-500",
    success: "bg-lime-500 text-white hover:bg-lime-600 focus:ring-lime-500",
    outline:
      "bg-transparent border border-teal-500 text-teal-500 hover:bg-teal-50 focus:ring-teal-500",
    // Add more variants as needed
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

IconButton.propTypes = {
  children: PropTypes.node.isRequired, // Typically an icon
  onClick: PropTypes.func,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "success",
    "outline",
  ]),
  className: PropTypes.string,
};

export default IconButton;
