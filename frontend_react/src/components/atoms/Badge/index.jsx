import React from "react";
import styles from "./index.module.css";

const Badge = ({ name, className, count = 0, config, badgeClass }) => {
  return (
    <div
      className={`${styles.badge} ${className} ${
        badgeClass ? styles[badgeClass] : ""
      }`}
      {...config}
    >
      <div className={styles["badge-inner"]}>{name}</div>
      <div className={styles["badge-count"]}>
        <span className={styles["badge-count-inner"]}>{count}</span>
      </div>
    </div>
  );
};

export default React.memo(Badge);
