import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Line, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const components = {
  bar: Bar,
  line: Line,
  pie: Pie,
};

const Graph = ({ data, title, className, type, config }) => {
  const GraphComponent = components[type];

  return (
    <div className={`${className}`}>
      <h3>{title}</h3>

      <GraphComponent {...config} data={data} />
    </div>
  );
};

export default React.memo(Graph);
