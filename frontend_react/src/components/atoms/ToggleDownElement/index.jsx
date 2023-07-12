import { useState } from "react";
import styles from "./index.module.css";

const ToggleDownElement = ({ name, inner, className, innerClassName }) => {
  const [isVisible, setIsVisible] = useState(false);

  const clickHandler = () => {
    setIsVisible((val) => !val);
  };

  return (
    <div className={`${styles["dropdown-element"]} ${className}`}>
      <div
        onClick={clickHandler}
        className={`${styles["dropdown-name"]} col-12 ${innerClassName}`}
      >
        {name}
        {isVisible && <i className={styles.arrow + " " + styles.up} />}
        {!isVisible && <i className={styles.arrow + " " + styles.down} />}
      </div>
      {isVisible && (
        <div className={`${styles["dropdown-inner"]} col-12 ${innerClassName}`}>
          {inner}
        </div>
      )}
    </div>
  );
};

export default ToggleDownElement;
