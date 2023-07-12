import Graph from "_atoms/Graph";
import styles from "./index.module.css";

const UserActivityGraphs = ({ className, activities, options }) => {
  const counter = activities.length;

  const getData = (option) => {
    const data = {};
    activities.map((item) => {
      if (!Object.keys(data).includes(data[item[option.name]])) {
        data[item[option.name]] = 0;
      }
      data[item[option.name]] = data[item[option.name]] + 1;
    });
    const labels = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      labels.push(option.transformKey ? option.transformKey(key) : key);
      values.push(option.transformValue ? option.transformValue(value) : value);
    }
    return { labels, values };
  };

  return (
    <div className={`${styles["side-container"]} ${className}`}>
      <div className={`${styles["side-inner"]} text-center text-md-left`}>
        <div className={styles["side-header"]}>
          <h3>
            <strong>Contributi</strong>
          </h3>
          <p>{counter}</p>
        </div>
        {options.map((option) => (
          <Graph
            key={option.label}
            title={option.label}
            type={option.type}
            config={option.config}
            data={{
              labels: getData(option).labels,
              datasets: [
                {
                  data: getData(option).values,
                  ...option.dataConfig,
                },
              ],
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default UserActivityGraphs;
