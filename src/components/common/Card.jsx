// components/common/Card.js

import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={classNames(
        "bg-white dark:bg-gray-800 rounded-lg shadow p-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;
