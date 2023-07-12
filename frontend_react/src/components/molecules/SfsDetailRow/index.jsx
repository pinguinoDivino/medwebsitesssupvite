import styles from "./index.module.css";

const SfsDetailRow = ({ attrs, className }) => {
  return (
    <div className={`row ${className}`}>
      <div className="col-12">
        <h4>Istituto:</h4>
        <span className="bold">{attrs.institution}</span>
      </div>
      <div className="col-12">
        <h4 className="mt-1">Si può scrivere la tesi?</h4>
        {attrs.thesis === true && <div className={styles.check} />}
        {attrs.thesis === false && <div>No</div>}
        {!attrs.thesis && (
          <div className="not-found">
            <p>Non disponibile</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SfsDetailRow;
