import Graph from "_atoms/Graph";

const ExperienceGraphsRow = ({ data, className }) => {
  const getData = (option) => {
    const labels = [];
    const values = [];
    for (const [key, value] of Object.entries(data[option.name])) {
      labels.push(option.transformKey ? option.transformKey(key) : key);
      values.push(option.transformValue ? option.transformValue(value) : value);
    }
    return { labels, values };
  };

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
    {
      label: "Tags più usati",
      name: "tags",
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
    {
      label: "Stati più visitati",
      name: "country",
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
    <div className={`row mt-1 pb-1 ${className}`}>
      <h2 className="col-12"> Statistiche Generali </h2>
      {options.map((option) => (
        <Graph
          className="col-md-4 text-center"
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
  );
};

export default ExperienceGraphsRow;
