// components/common/NavigationLink.js

import classNames from "classnames";
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";

const NavigationLink = ({ href, children, isActive, ...props }) => {
  const baseStyles =
    "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300";

  const activeStyles = isActive
    ? "bg-gray-900 text-white"
    : "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <Link
      href={href}
      className={classNames(baseStyles, activeStyles)}
      {...props}
    >
      {children}
    </Link>
  );
};

NavigationLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
};

export default NavigationLink;
