import { useReducer, useEffect } from "react";
import SelectInput from "_atoms/SelectInput";

const inputsReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE": {
      const newState = { ...state, [action.index]: action.val };
      for (const key of Object.keys(newState)) {
        if (key > action.index) {
          newState[key] = "";
        }
      }
      return newState;
    }
    default:
      return state;
  }
};

const getInitialState = (inputs) => {
  const obj = {};
  for (const index in inputs) {
    obj[index] = "";
  }
  return obj;
};

const MultipleFilterSelectInput = ({
  onChange,
  inputs,
  className,
  title,
  textTitle,
  value,
  inputListRemoveHandler,
  displaySelectedItemFn,
  multiple,
}) => {
  const [inputsState, dispatchInputsState] = useReducer(
    inputsReducer,
    getInitialState(inputs),
    undefined
  );
  const onChangeHandler = (index, val) => {
    dispatchInputsState({ type: "INPUT_CHANGE", index, val });
  };

  useEffect(() => {
    if (inputsState[inputs.length - 1]) {
      onChange(inputsState[inputs.length - 1]);
    }
  }, [inputsState[inputs.length - 1]]);

  return (
    <div className={`${className}`}>
      {textTitle && !title && <h3>{textTitle}</h3>}
      {title}
      <div className="row form-row">
        {inputs.map((input, index) => {
          if (index === 0 || (index !== 0 && inputsState[index - 1])) {
            return (
              <div
                key={index}
                className={` col-${Math.floor(12 / inputs.length)}`}
              >
                <label>{input.label}</label>
                <SelectInput
                  key={index}
                  className={input.className}
                  onChange={onChangeHandler.bind(this, index)}
                  value={inputsState[index]}
                  options={input.options.filter((option) => {
                    if (index === 0) {
                      return true;
                    }
                    return option[input.searchField] === inputsState[index - 1];
                  })}
                />
              </div>
            );
          }
        })}
      </div>
      {multiple && value.length >= 1 && (
        <div className="row form-row">
          <div className="col-12 lighbold">
            <label>{textTitle} selezionate</label>
          </div>
          {value.map((item, index) => (
            <div key={index} className="col-md-6">
              {displaySelectedItemFn(item)}
              <span
                className="remove-file"
                onClick={inputListRemoveHandler.bind(this, item)}
              >
                Rimuovi
              </span>
            </div>
          ))}
        </div>
      )}
      {!multiple && !!value && (
        <div className="row form-row">
          <div className="col-12 lighbold">
            <label>{textTitle} selezionata</label>
          </div>
          <div className="col-md-6">
            {displaySelectedItemFn(value)}
            <span className="remove-file" onClick={onChange.bind(this, "")}>
              Rimuovi
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleFilterSelectInput;
