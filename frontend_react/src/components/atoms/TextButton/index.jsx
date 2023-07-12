import React from "react";
import styles from "./index.module.css";

const TextButton = ({
  type,
  onClick,
  children,
  className,
  mode = "primary",
}) => {
  return (
    <button
      onClick={type === "button" || !type ? onClick : undefined}
      type={type ? type : "button"}
      className={styles[mode] + " " + styles.button + " " + className}
    >
      {children}
    </button>
  );
};

export default React.memo(TextButton);
