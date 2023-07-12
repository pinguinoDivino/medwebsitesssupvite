import React from "react";

const Copyright = ({ text, className }) => {
  return <span className={`${className}`}>{text}</span>;
};

export default React.memo(Copyright);
