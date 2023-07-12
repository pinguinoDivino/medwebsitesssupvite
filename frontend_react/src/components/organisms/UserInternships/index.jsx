import UserActivityItem from "_molecules/UserActivityItem";
import UserActivityGraphs from "_molecules/UserActivityGraphs";

const UserInternships = ({
  className,
  hasActivities,
  activities,
  onDeleteHandler,
}) => {
  const options = [
    {
      label: "Reparti",
      name: "ward",
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
    {
      label: "Anni",
      name: "academic_year",
      type: "bar",
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
      config: {
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
        },
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
                activity={{ ...activity, type: "tirocini-unipi" }}
                textKey="review"
                ratingKey="rating"
                showStartingDate={false}
                onDeleteHandler={onDeleteHandler}
                headerText={
                  <p className="mt-1">
                    <strong>Reparto: </strong>
                    {activity.ward}
                  </p>
                }
              />
            ))}
          </div>
        </div>
      )}
      {!hasActivities && (
        <div className="mt-1">
          <p className="not-found">Non sono stati trovati tirocini</p>
        </div>
      )}
    </div>
  );
};
export default UserInternships;
