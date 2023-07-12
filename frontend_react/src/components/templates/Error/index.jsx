import styles from "./index.module.css";

const Error = ({ errorText }) => {
  let message = errorText ? errorText : "404 - Pagina Non Trovata";

  return (
    <div className={`container-fluid ${styles["not-found"]}`}>
      <div className="container mt-3">
        <h1 className={[styles.notfound]}>{message}</h1>
      </div>
    </div>
  );
};

export default Error;
