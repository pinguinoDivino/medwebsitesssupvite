import { useState, useEffect } from "react";
import styles from "./index.module.css";

const CounterInput = ({
  className,
  onChange,
  value = null,
  mdCounter = false,
  longCounter = false,
  placeholder = "",
  config,
}) => {
  const [number, setNumber] = useState(value ? parseFloat(value) : 0);

  const max = config?.max ? config.max : 10;
  const min = config?.min ? config.min : 0;

  const minusValue = () => {
    setNumber((val) => {
      if (val > min) {
        return val - 1;
      }
      return val;
    });
  };

  const plusValue = () => {
    setNumber((val) => {
      if (val < max) {
        return val + 1;
      }
      return val;
    });
  };

  const handleChange = (event) => {
    setNumber((val) => {
      const newVal = parseFloat(event.target.value)
        ? parseFloat(event.target.value)
        : 0;
      if (newVal <= max && newVal >= 0) {
        return newVal;
      }
      return val;
    });
  };

  useEffect(() => {
    onChange(number);
  }, [number]);

  return (
    <div className={` ${styles.number} ${className}`}>
      <span className={styles.minus} onClick={minusValue}>
        -
      </span>
      <input
        placeholder={placeholder}
        type="number"
        className={`form-control ${styles.counter} ${
          longCounter ? styles["counter-lg"] : null
        } ${mdCounter ? styles["counter-md"] : null}`}
        onChange={handleChange}
        value={number}
        {...config}
      />
      <span className={styles.plus} onClick={plusValue}>
        +
      </span>
    </div>
  );
};

export default CounterInput;
