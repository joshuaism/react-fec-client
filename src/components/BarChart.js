import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ groups, labels }) {
  function getHeight() {
    const length = labels.length;
    if (length <= 5) {
      return 30;
    }
    return (10 * length) / 2;
  }

  const datasets = [{ data: [], label: "", barPercentage: 1.0, categoryPercentage: 1.0 }];
  Object.keys(groups)
    .sort()
    .filter((group) => labels.includes(group))
    .map((key) => {
      const group = groups[key];
      const total = group.reduce((total, c) => total + c.amount, 0);
      datasets[0].data.push(total);
      //datasets[0].backgroundColor.push(getPartyStyle(c.committee));
    });
  const data = { labels: labels.sort(), datasets: datasets };

  const options = {
    indexAxis: "y",
    scales: {
      y: {
        grid: { display: false },
      },
    },
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (item) {
            return item.raw.toLocaleString("en-US", { style: "currency", currency: "USD" });
          },
        },
      },
    },
  };

  return <Bar height={getHeight()} data={data} options={options} />;
}
