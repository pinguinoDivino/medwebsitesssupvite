import React from "react";
import styles from "./index.module.css";

const NavCollapsedButton = ({ onClick, className }) => {
  return (
    <div className={`${styles.button} ${className}`} onClick={onClick}>
      <div className={styles.line} />
      <div className={styles.line} />
      <div className={styles.line} />
    </div>
  );
};

export default React.memo(NavCollapsedButton);
