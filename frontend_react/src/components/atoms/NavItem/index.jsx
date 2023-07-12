import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./index.module.css";

const NavItem = ({ text, link, className, end = true, isInsideApp = true }) => {
  return (
    <li className={`${styles.item} ${className}`}>
      {isInsideApp && (
        <NavLink
          to={link}
          className={({ isActive }) => (isActive ? styles.active : undefined)}
          end={end}
        >
          {text}
        </NavLink>
      )}
      {!isInsideApp && <a href={link}>{text}</a>}
    </li>
  );
};

export default React.memo(NavItem);
