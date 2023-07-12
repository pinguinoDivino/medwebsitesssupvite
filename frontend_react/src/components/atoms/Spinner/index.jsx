import React from "react";
import styles from "./index.module.css";

const Spinner = ({ className }) => {
  return (
    <div className={`${styles.spinner} ${className}`}>
      <div className={styles["lds-roller"]}>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};
export default React.memo(Spinner);
