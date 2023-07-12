import { useState } from "react";
import MultipleCheckbox from "_molecules/MultipleCheckbox";
import styles from "./index.module.css";

const MultipleSearchCheckbox = ({
  options,
  state,
  changeStateHandler,
  config,
  placeholder,
  keyLabel,
  keyValue,
}) => {
  const [searchVal, setSearchVal] = useState("");

  const onChangeHandler = (e) => {
    setSearchVal(e.target.value);
  };

  let filteredOptions = options;

  if (searchVal) {
    filteredOptions = filteredOptions.filter((item) => {
      if (typeof item === "object") {
        return item[keyValue].toLowerCase().includes(searchVal);
      }
      return item.toLowerCase().includes(searchVal);
    });
  }

  const hasOptions = filteredOptions && filteredOptions.length > 0;

  return (
    <>
      <input
        placeholder={placeholder}
        value={searchVal}
        onChange={onChangeHandler}
        className={`${styles.search} form-control`}
      />
      <MultipleCheckbox
        options={filteredOptions}
        state={state}
        changeStateHandler={changeStateHandler}
        config={config}
        keyLabel={keyLabel}
        keyValue={keyValue}
      />
      {!hasOptions && <div className="not-found">Nessuna corrispondenza</div>}
    </>
  );
};

export default MultipleSearchCheckbox;
