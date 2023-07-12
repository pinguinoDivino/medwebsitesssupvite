import { getGoodDatePeriodFormat } from "_/common/utils";
import StarRating from "_atoms/StarRating";
import LinkItem from "_atoms/Link";
import SvgButton from "_molecules/SvgButton";
import styles from "./index.module.css";

const maxTextDisplay = 280;

const UserActivityItem = ({
  className,
  activity,
  ratingKey,
  textKey,
  headerText = null,
  showStartingDate = true,
  onDeleteHandler,
}) => {
  function getReview(string) {
    return string.replaceAll("&r)", "");
  }

  return (
    <div className={`${styles["item-container"]} ${className}`}>
      <div className={styles["item-inner"]}>
        <div className={styles["item-header"]}>
          <StarRating
            value={ratingKey ? activity[ratingKey] : activity.rating.average}
          />
          {headerText}
          {!headerText && (
            <LinkItem
              link={`/esperienze/${activity.slug}`}
              text={activity.description}
            />
          )}
        </div>
        <div className={styles["item-body"]}>
          {showStartingDate && (
            <p className="mt-1">
              <strong>Data di inizio</strong>:{" "}
              {getGoodDatePeriodFormat(activity.started_at)}
            </p>
          )}
          {activity[textKey].length < maxTextDisplay && (
            <p>{getReview(activity[textKey])}</p>
          )}
          {activity[textKey].length >= maxTextDisplay && (
            <p>
              {getReview(activity[textKey].substring(0, maxTextDisplay) + "..")}
            </p>
          )}
          {activity.created_at === activity.updated_at && (
            <p>
              <strong>Data di aggiunta</strong>:{" "}
              {getGoodDatePeriodFormat(activity.created_at)}
            </p>
          )}
          {activity.created_at !== activity.updated_at && (
            <p>
              <strong>Data di modifica</strong>:{" "}
              {getGoodDatePeriodFormat(activity.updated_at)}
            </p>
          )}
        </div>
        <div className={styles["item-footer"]}>
          <LinkItem
            link={`/attività-editor/${
              activity.type === "tirocini-unipi" ? "tirocini" : "esperienze"
            }/${activity.slug}`}
            state={{ type: activity.type }}
            text="Modifica"
          />
          <SvgButton
            onclick={onDeleteHandler.bind(this, activity.slug)}
            mode="danger"
            svg={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash"
                viewBox="0 0 16 16"
              >
                <path
                  d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0
               1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                />
                <path
                  fillRule="evenodd"
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 
                1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default UserActivityItem;
