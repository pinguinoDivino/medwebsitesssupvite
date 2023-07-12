import React from "react";
import styles from "./index.module.css";

const SubTitle = ({ text, className }) => {
  return (
    <div className={className}>
      <h2 className={styles.h2}>{text}</h2>
    </div>
  );
};

export default React.memo(SubTitle);
