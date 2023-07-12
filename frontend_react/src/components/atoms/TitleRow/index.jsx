import React from "react";

const TitleRow = ({ title, className }) => {
  return (
    <div className={`row ${className}`}>
      <div className={`col-12 text-center ${className}`}>
        <h1>{title}</h1>
      </div>
    </div>
  );
};

export default React.memo(TitleRow);
