import React from "react";
import styles from "./index.module.css";

const DateInput = ({ className, value, onChange, label, inline = true }) => {
  const changeHandler = (e) => {
    onChange(e.target.value);
  };

  return (
    <div
      className={`${styles.date} ${
        inline ? styles["inline-date"] : ""
      } ${className}`}
    >
      <label htmlFor={"radio-" + label}>{label}</label>
      <input
        type="date"
        id={"date-" + label}
        value={value || ""}
        className="form-control"
        onChange={changeHandler}
      />
    </div>
  );
};

export default React.memo(DateInput);
