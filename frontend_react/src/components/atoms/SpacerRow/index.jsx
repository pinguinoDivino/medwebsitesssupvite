import React from "react";
import styles from "./index.module.css";

const SpacerRow = ({ className }) => {
  return <div className={`row ${styles.spacer} ${className}`} />;
};

export default React.memo(SpacerRow);
