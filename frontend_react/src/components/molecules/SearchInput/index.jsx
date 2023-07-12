import styles from "./index.module.css";

const SearchInput = ({ value, onChange, className, placeholder, config }) => {
  return (
    <div className={className}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={styles["searching-input"] + " form-control"}
        placeholder={placeholder}
        {...config}
      />
    </div>
  );
};

export default SearchInput;
