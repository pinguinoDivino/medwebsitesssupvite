import React from "react";
import Select from "react-select";
import styles from "./index.module.css";

const SelectInput = ({
  className,
  options,
  onChange,
  onBlur,
  onFocus,
  value,
  config,
}) => {
  const val = value
    ? options.filter((item) => item.value === value)[0]
    : options[0];

  const baseSelectConfig = {
    classNamePrefix: styles["select-input"] + " ",
    classNames: {
      control: () => styles["select-inner"],
      menu: () => styles["select-menu"],
    },
    styles: {
      control: (baseStyles, state) => {
        return {
          ...baseStyles,
          borderColor: state.isHovered ? "black" : "black",
        };
      },
    },
  };

  const onChangeHandler = (val) => {
    onChange(val.value);
  };

  const selectConfig = { ...baseSelectConfig, ...config };

  return (
    <div className={className}>
      <Select
        options={options}
        onChange={onChangeHandler}
        onFocus={onFocus}
        onBlur={onBlur}
        value={val}
        {...selectConfig}
      />
    </div>
  );
};

export default React.memo(SelectInput);
