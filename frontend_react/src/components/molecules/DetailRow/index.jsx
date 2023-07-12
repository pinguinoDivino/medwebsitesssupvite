import styles from "./index.module.css";

const DetailRow = ({
  text,
  subA,
  subB,
  subC,
  className,
  isTextLeft = false,
  isHrShown = true,
}) => {
  return (
    <>
      <div className={`row element ${styles["detail-row"]} ${className}`}>
        <div className={`col-lg-4 ${isTextLeft ? "order-lg-last pl-2" : ""} `}>
          <div className={styles.subtitleA}>{subA}</div>
          <div className={styles.subtitleB}>{subB}</div>
          <div className={styles.subtitleC}>{subC}</div>
        </div>
        <div className={`col-lg-8 ${styles["text-container"]}`}>
          <p className={styles.p}>{text}</p>
        </div>
      </div>
      {isHrShown && <hr />}
    </>
  );
};

export default DetailRow;
