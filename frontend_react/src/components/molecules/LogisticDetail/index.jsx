import { dateDiff } from "_/common/utils";
import styles from "./index.module.css";

const LogisticDetail = ({
  staringDate,
  endingDate,
  universities,
  city,
  className,
}) => {
  const duration = endingDate
    ? dateDiff(staringDate, endingDate, "it")
    : "In corso";

  return (
    <div
      className={`col-md-4 col-lg-3 text-center text-md-left shadow ${styles.grey} ${className}`}
    >
      <div>
        <h3 className="my-1">Quando?</h3>
        <p>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          L'esperienza è iniziata il <strong>{staringDate}</strong>
        </p>
        {endingDate && (
          <p>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            E' conclusa il <strong>{endingDate}</strong> con una durata complessiva
            di &nbsp;
            <i>{duration}</i>
          </p>
        )}
        {!endingDate && (
          <p>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            L'esperienza <i className="not-found">non si è ancora conclusa</i>
          </p>
        )}
      </div>
      <div>
        <h3 className="my-1">Dove?</h3>
        <p>
          Principalmente presso la città di{" "}
          <span className="bold">{city.city}</span>, {city.country}
        </p>
      </div>
      {universities.length > 0 && (
        <div>
          <h3 className="my-1">Collaborazioni con</h3>
          {universities.map((univ) => (
            <p key={univ.id}>
              <a href={univ.link} target="_blank" rel="noreferrer">
                {univ.name}
              </a>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogisticDetail;
