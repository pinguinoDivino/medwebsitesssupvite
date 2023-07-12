import CheckboxInput from "_atoms/CheckboxInput";

const MultipleCheckbox = ({
  options,
  state,
  changeStateHandler,
  config,
  keyValue = undefined,
  keyLabel = undefined,
}) => {
  const isChecked = (value) => {
    return state.includes(value.toString());
  };

  const onChangeHandler = (e) => {
    const valKey = e.target.value;
    const val = e.target.checked;
    changeStateHandler({ [valKey]: val });
  };

  const getVal = (option, keyA = 0, keyO = "name") => {
    return Array.isArray(option)
      ? option[keyA]
      : typeof option === "object" && option !== null
      ? option[keyO]
      : option;
  };

  return (
    <>
      {options.map((option, index) => (
        <CheckboxInput
          key={index}
          value={getVal(option, 0, keyValue)}
          labelText={getVal(option, 1, keyLabel)}
          isChecked={isChecked(getVal(option, 0, keyValue))}
          onChange={onChangeHandler}
          {...config}
        />
      ))}
    </>
  );
};

export default MultipleCheckbox;
