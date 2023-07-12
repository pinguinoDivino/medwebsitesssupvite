import RadioInput from "_atoms/RadioInput";
import styles from "./index.module.css";

const MultipleRadioInput = ({ className, inputs, value, onChange }) => {
  return (
    <div className={` ${styles.inline} ${className}`}>
      {inputs.map((input, index) => (
        <RadioInput
          key={index}
          value={input.value}
          label={input.label}
          isChecked={value === input.value}
          onChange={onChange}
          className={input.className}
        />
      ))}
    </div>
  );
};

export default MultipleRadioInput;
