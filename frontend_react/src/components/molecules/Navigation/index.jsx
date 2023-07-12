import NavItem from "_atoms/NavItem";
import styles from "./index.module.css";

const Navigation = ({ navItems, className }) => {
  return (
    <ul className={`${styles.navigation} ${className}`}>
      {navItems.map((item, index) => {
        return <NavItem key={index} {...item} />;
      })}
    </ul>
  );
};

export default Navigation;
