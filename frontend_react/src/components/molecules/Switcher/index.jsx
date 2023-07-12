import styles from "./index.module.css";

const Switcher = ({ onClick, toggled, className }) => {
  const handleClick = () => {
    onClick(!toggled);
  };

  return (
    <div
      onClick={handleClick}
      className={`${styles.toggle} ${toggled ? styles.night : ""} ${className}`}
    >
      <div className={styles.notch}>
        <div className={styles.crater} />
        <div className={styles.crater} />
      </div>
      <div>
        <div className={`${styles.shape} ${styles.sm}`} />
        <div className={`${styles.shape} ${styles.sm}`} />
        <div className={`${styles.shape} ${styles.md}`} />
        <div className={`${styles.shape} ${styles.lg}`} />
      </div>
    </div>
  );
};

export default Switcher;
