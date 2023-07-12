import styles from "./index.module.css";
import NavItem from "_atoms/NavItem";

const NavLogo = ({ link, text, className }) => {
  return (
    <div className={`${styles["nav-logo"]} ${className}`}>
      <NavItem link={link} text={text} />
    </div>
  );
};

export default NavLogo;
