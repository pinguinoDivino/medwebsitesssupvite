import UserActivityItem from "_molecules/UserActivityItem";
import UserActivityGraphs from "_molecules/UserActivityGraphs";

const UserExperiences = ({
  className,
  hasActivities,
  activities,
  onDeleteHandler,
}) => {
  const options = [
    {
      label: "Tipologia",
      name: "type",
      type: "pie",
      dataConfig: {
        label: "",
        backgroundColor: [
          "#449c9f",
          "#8c6292",
          "#f56300",
          "#d04f4f",
          "#50AC49",
          "#FF9E7A",
        ],
        borderColor: [
          "#449c9f",
          "#8c6292",
          "#f56300",
          "#d04f4f",
          "#50AC49",
          "#FF9E7A",
        ],
        borderWidth: 1,
      },
    },
  ];

  return (
    <div className={`${className} `}>
      {hasActivities && (
        <div className="row mt-1">
          <UserActivityGraphs
            className="col-md-4 col-lg-3"
            activities={activities}
            options={options}
          />
          <div className="col-12 col-md-8">
            {activities.map((activity) => (
              <UserActivityItem
                key={activity.id}
                activity={activity}
                textKey="review"
                onDeleteHandler={onDeleteHandler}
              />
            ))}
          </div>
        </div>
      )}
      {!hasActivities && (
        <div className="mt-1">
          <p className="not-found">Non sono state trovate esperienze</p>
        </div>
      )}
    </div>
  );
};
export default UserExperiences;
