import React from "react";
import { Link } from "react-router-dom";
import styles from "_atoms/NavItem/index.module.css";

const LinkItem = ({
  text,
  link,
  className,
  state,
  isInsideApp = true,
  options = null,
}) => {
  return (
    <div className={`${styles.item} ${className}`}>
      {isInsideApp && (
        <Link to={link} state={state}>
          {text}
        </Link>
      )}
      {!isInsideApp && (
        <a href={link} {...options}>
          {text}
        </a>
      )}
    </div>
  );
};

export default React.memo(LinkItem);
