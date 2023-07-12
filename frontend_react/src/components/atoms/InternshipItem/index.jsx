import React from "react";
import StarRating from "_atoms/StarRating";
import styles from "./index.module.css";

const InternshipItem = ({ item }) => {
  return (
    <div className={styles["review-container"]}>
      <div className={styles["review-header"]}>
        <p>
          di <span className="bold">{item.author}</span>, svolta al &nbsp;
          {item.academic_year}
          &nbsp; anno
        </p>
        <p>
          presso <span className="bold">{item.place}</span>, consigliato da
          svolgere al &nbsp;
          <span className="bold">{item.recommended_year} anno</span>
        </p>
      </div>
      <div className={styles["review-content"]}>
        <p>{item.review}</p>
        <StarRating value={item.rating} />
        <hr />
      </div>
    </div>
  );
};

export default React.memo(InternshipItem);
