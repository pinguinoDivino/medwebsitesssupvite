import { useState } from "react";
import useAuth from "_hooks/use-auth.jsx";
import NavLogo from "_molecules/NavLogo";
import NavCollapsedButton from "_atoms/NavCollapsedButton";
import Navigation from "_molecules/Navigation";
import Switcher from "_molecules/Switcher";
import styles from "./index.module.css";

const MainNavigation = ({ className }) => {
  const { userIsAuth1, theme, changeUserTheme } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const toggleNavBar = (payload) => {
    setIsOpen(payload);
  };

  const switchTheme = (payload) => {
    if (payload) {
      changeUserTheme({ theme: "dark" });
    } else {
      changeUserTheme({ theme: "light" });
    }
  };

  if (theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  const toggled = theme === "dark";

  const navItems = [
    {
      text: "Esperienze",
      link: "/esperienze",
      end: false,
    },
    userIsAuth1 && {
      text: "Tirocini",
      link: "/tirocini-curricolari",
    },
    /*{
      text: "Opportunità",
      link: "/opportunità",
    },*/
    {
      text: "Aggiungi",
      link: "/attività-editor",
      end: false,
    },
    {
      text: "Area Personale",
      link: "/area-personale",
    },
    {
      isInsideApp: false,
      text: "Logout",
      link: "/accounts/logout/",
    },
  ];

  return (
    <header className={`${styles.header} ${className}`}>
      <nav className={styles.nav}>
        <div className={styles.navbar}>
          <NavLogo text="Med. Sant'Anna" link="/" />
          <NavCollapsedButton onClick={toggleNavBar.bind("payload", true)} />
        </div>
        <div
          id="menu"
          className={`${styles.menu} ${isOpen ? styles.open : undefined}`}
          onClick={toggleNavBar.bind("payload", false)}
        >
          <Navigation navItems={navItems} />
          <Switcher onClick={switchTheme} toggled={toggled} />
        </div>
      </nav>
    </header>
  );
};

export default MainNavigation;
