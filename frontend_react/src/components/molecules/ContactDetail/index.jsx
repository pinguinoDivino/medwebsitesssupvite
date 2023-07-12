import styles from "./index.module.css";

const ContactDetail = ({
  author,
  authorYear,
  authorEmail,
  authorContact,
  reference,
  className,
}) => {
  const hasContact =
    authorContact !== "email istituzionale" &&
    authorContact !== authorEmail &&
    authorContact !== "";

  return (
    <div className={`col-lg-5 ${styles.contacts} ${className}`}>
      <h3>Chi sono?</h3>
      <p>
        Sono <span className="author">{author}</span>
      </p>
      <h3>A che anno sono?</h3>
      {authorYear === "Ex-Allievo" && <p>Sono un ex-allievo</p>}
      {authorYear !== "Ex-Allievo" && <p>Sono al {authorYear} anno</p>}
      <h3>Come puoi contattarmi?</h3>
      Scrivendomi alla email:
      <span className={styles.email}> {authorEmail}</span>
      {hasContact && <p>Ecco un altro mio contatto: {authorContact}</p>}
      <h3 className="mt-1">
        A chi ti devi rivolgere per organizzare l&apos; esperienza?
      </h3>
      <p className={styles.reference}>{reference}</p>
    </div>
  );
};

export default ContactDetail;
