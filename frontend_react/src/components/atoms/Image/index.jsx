import React from "react";
import styles from "./index.module.css";

const Image = ({ url, className, text = "Immagine" }) => {
  return (
    <div className={`${styles["img-container"]} ${className}`}>
      <img
        src={url}
        className={`img-thumbnail img-responsive ${styles["fit-img"]}`}
        alt={text}
      />
    </div>
  );
};

export default React.memo(Image);
