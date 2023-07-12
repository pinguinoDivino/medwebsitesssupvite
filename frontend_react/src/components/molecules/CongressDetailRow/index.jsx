import styles from "./index.module.css";

const CongressDetailRow = ({ attrs, className }) => {
  return (
    <div className={`row ${className}`}>
      <div className="col-12">
        <div className="row">
          <div className="col-lg-6">
            <h4>Titolo</h4>
            <span className={`display-7 ${styles.title} `}>
              {attrs.link && (
                <a
                  href={attrs.link}
                  target="_blank"
                  className={styles.link}
                  rel="noreferrer"
                >
                  {attrs.title}
                </a>
              )}
              {!attrs.link && <span className="display-7">{attrs.title}</span>}
            </span>
          </div>
          <div className="col-md-9 col-lg-4">
            <h4>Ente</h4>
            {attrs.link_organization && (
              <a
                href={attrs.link_organization}
                target="_blank"
                className={`display-7 ${styles.link}`}
                rel="noreferrer"
              >
                {attrs.organization}
              </a>
            )}
            {!attrs.link_organization && (
              <span className="bold display-7">{attrs.organization}</span>
            )}
          </div>
          <div className="col-md-3 col-lg-2">
            <h4>Costo</h4>
            <span className="display-7">{attrs.cost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CongressDetailRow;
