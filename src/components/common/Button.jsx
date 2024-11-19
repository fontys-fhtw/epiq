// components/common/Button.js

import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  className,
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition";

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
      type={type}
      onClick={onClick}
      className={classNames(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "success",
    "outline",
  ]),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
