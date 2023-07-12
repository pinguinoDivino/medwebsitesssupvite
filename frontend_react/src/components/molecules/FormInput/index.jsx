import React from "react";

const FormInput = ({
  state,
  inputChangeHandler,
  inputBlurHandler,
  inputFocusHandler,
  label,
  config,
  className,
  children,
}) => {
  const onInputChangeHandler = (e) => {
    inputChangeHandler(e.target.value);
  };
  // in production constructor name of textinput changes to t!
  const onChildrenInputChangeHandler = (e) => {
    if (
      e?.constructor.name === "SyntheticBaseEvent" ||
      e?.constructor.name === "t"
    ) {
      inputChangeHandler(e.target.value);
    } else {
      inputChangeHandler(e);
    }
  };

  return (
    <div
      className={`${
        !state.isValid && state.isTouched ? "invalid" : ""
      } ${className}`}
    >
      {label && <label htmlFor={config.id}>{label}</label>}
      {!children && (
        <input
          className="form-control"
          value={state.value}
          onChange={onInputChangeHandler}
          onFocus={inputFocusHandler}
          onBlur={inputBlurHandler}
          {...config}
        />
      )}
      {children &&
        React.cloneElement(children, {
          className: "form-control",
          value: state.value,
          onChange: onChildrenInputChangeHandler,
          onFocus: inputFocusHandler,
          onBlur: inputBlurHandler,
          ...config,
        })}
      {!state.isValid && state.isTouched && (
        <div className="bold small-1 invalid-message">{state.errorText}</div>
      )}
    </div>
  );
};

export default FormInput;
