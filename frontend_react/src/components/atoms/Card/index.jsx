import React from "react";
import styles from "index.module.css";

const Card = ({
  header,
  body,
  footer,
  className,
  backgroundColor,
  headerFontColor = "#ffffff",
  headerFontSize = "2rem",
}) => {
  return (
    <div
      className={`${styles.card} ${className}`}
      style={{ backgroundColor: backgroundColor }}
    >
      <div className={styles.cardInner}>
        <div
          className={styles.cardHeader}
          style={{ color: headerFontColor, fontSize: headerFontSize }}
        >
          {header}
        </div>
        <div className={styles.cardBody}>{body}</div>
        <div className={styles.cardFooter}>{footer}</div>
      </div>
    </div>
  );
};

export default React.memo(Card);
