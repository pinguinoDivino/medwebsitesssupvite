import React from "react";

const CheckboxInput = ({
  className,
  labelText,
  onChange,
  value,
  isChecked,
  suffix,
}) => {
  return (
    <div className={`checkbox ${className}`}>
      <input
        type="checkbox"
        onChange={onChange}
        value={value}
        checked={isChecked}
        id={value + "-" + suffix}
      />
      <label htmlFor={value + "-" + suffix}>{labelText}</label>
    </div>
  );
};

export default React.memo(CheckboxInput);
