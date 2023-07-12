import ReactDOM from "react-dom";

import styles from "./index.module.css";

const Backdrop = ({ onClose }) => {
  return <div className={styles.backdrop} onClick={onClose} />;
};

const ModalOverlay = ({ children, title }) => {
  return (
    <div className={styles.modal}>
      {title && (
        <div className={styles.title}>
          <h2 className="bold text-center">{title}</h2>
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

const portalElement = document.getElementById("overlay-root");

const Modal = ({ onClose, children, title = null }) => {
  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClose={onClose} />, portalElement)}
      {ReactDOM.createPortal(
        <ModalOverlay title={title}>{children}</ModalOverlay>,
        portalElement
      )}
    </>
  );
};

export default Modal;
