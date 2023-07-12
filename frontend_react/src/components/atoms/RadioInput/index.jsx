import React from "react";

const RadioInput = ({
  className,
  value,
  onChange,
  label,
  isChecked,
  config,
}) => {
  const onChangeHandler = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={`${className}`}>
      <input
        type="radio"
        id={"radio-" + label}
        value={value || ""}
        onChange={onChangeHandler}
        checked={isChecked}
        className="form-control"
        {...config}
      />
      <label htmlFor={"radio-" + label} style={{ paddingLeft: "0.2rem" }}>
        {label}
      </label>
    </div>
  );
};

export default React.memo(RadioInput);
