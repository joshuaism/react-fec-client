import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { REPUBLICAN, DEMOCRATIC } from "../constants";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ groups, labels }) {
  const sortedLabels = labels.sort();

  const committeeData = {};
  const committeeColors = [];

  const labeledData = sortedLabels.map((key) => {
    const dataObj = {};
    dataObj.y = key;
    groups[key].map((c) => {
      const committeeKey = c.committee? c.committee.name : "null";
      if (dataObj[committeeKey]) {
        dataObj[committeeKey] = dataObj[committeeKey] + c.amount;
      } else {
        dataObj[committeeKey] = c.amount;
        committeeColors[committeeKey] = getPartyColor(c);
      }
    });
    return dataObj;
  });

  labeledData.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (key !== "y") {
        committeeData[key] = {
          label: key,
          data: labeledData,
          backgroundColor: committeeColors[key],
          barPercentage: 1.0,
          categoryPercentage: 1.0,
          parsing: {
            xAxisKey: key,
          },
        };
      }
    });
  });

  function getPartyColor(contribution) {
    if (contribution.committee == null) {
      return "#999";
    }
    if (REPUBLICAN.includes(contribution.committee.name)) {
      return "rgba(241, 141, 141, 256)";
    }
    if (DEMOCRATIC.includes(contribution.committee.name)) {
      return "rgba(173, 216, 230, 256)";
    }
    const party = contribution.committee.party;
    if (party.indexOf("DEMOCRATIC") > -1) return "rgba(173, 216, 230, 256)";
    if (party.indexOf("REPUBLICAN") > -1) return "rgba(241, 141, 141, 256)";
    if (party.indexOf("LIBERTARIAN") > -1) return "rgba(228, 228, 154, 256);";
    if (party.indexOf("GREEN") > -1) return "rgba(157, 255, 157, 256)";
    return "#fff";
  }

  const finalData = Object.keys(committeeData).map((key) => committeeData[key]);

  function getHeight() {
    const length = sortedLabels.length;
    if (length <= 5) {
      return 30;
    }
    return (10 * length) / 2;
  }

  const data = { labels: sortedLabels, datasets: finalData };

  const options = {
    indexAxis: "y",
    scales: {
      y: {
        stacked: true,
        grid: { display: false },
      },
      x: {
        stacked: true,
      },
    },
    elements: {
      bar: {
        borderWidth: 2,
        borderColor: "#000",
      },
    },
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (item) {
            if (item.formattedValue === "0") {
              return "";
            }
            if (item.dataset.label) {
              let label = item.dataset.label;
              if (item.parsed.x !== null) {
                label = label + ": " + item.parsed.x.toLocaleString("en-US", { style: "currency", currency: "USD" });
                return label;
              }
            }
          },
        },
      },
    },
  };

  return <Bar height={getHeight()} data={data} options={options} />;
}
