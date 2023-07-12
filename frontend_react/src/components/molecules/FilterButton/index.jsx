import TextButton from "_atoms/TextButton";
import styles from "./index.module.css";

const FilterButton = ({ onClick, className, isClicked }) => {
  return (
    <div className={`${className}`}>
      <TextButton
        type="button"
        mode="outline"
        className={`${styles["filter-button"]} `}
        onClick={onClick}
      >
        <span
          className={`${styles["filter-icon"]} ${
            isClicked ? styles.rotate : ""
          }`}
        >
          <span className={`${styles.line} ${styles.line1}`} />
          <span className={`${styles.line} ${styles.line2}`} />
          <span className={`${styles.line} ${styles.line3}`} />
        </span>
        <span className={styles.text}> Filtra</span>
      </TextButton>
    </div>
  );
};

export default FilterButton;
