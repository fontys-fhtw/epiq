import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

const Heading = ({ level = 1, children, className, ...props }) => {
  const Tag = `h${level}`;

  const baseStyles = classNames("text-white font-bold", className);

  return (
    <Tag className={baseStyles} {...props}>
      {children}
    </Tag>
  );
};

Heading.propTypes = {
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Heading;
