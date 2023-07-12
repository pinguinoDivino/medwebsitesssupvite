import styles from "./index.module.css";
import Link from "_atoms/Link";
import Copyright from "_atoms/Copyright";

const MainFooter = ({ userIsStaff, className }) => {
  const links = [
    userIsStaff && {
      text: "Admin",
      link: "/amministrazione/pannello/",
      isInsideApp: false,
    },
    {
      text: "Trattamento dati",
      link: "/accounts/trattamento-dati/",
      isInsideApp: false,
      options: { target: "_blank", rel: "noopener noreferrer" },
    },
  ];

  return (
    <footer className={`footer ${styles["sticky-footer"]} ${className}`}>
      <div className="my-auto">
        <div className={`${styles.copyright} text-center my-auto`}>
          {links.map((item, index) => (
            <Link {...item} key={index} className="mb-1" />
          ))}
          <Copyright text="Copyright &copy; Scuola Superiore Sant' Anna 2023" />
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
