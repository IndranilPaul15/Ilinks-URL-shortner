import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data = [], clicks }) => {
  const values = data.map((item) => parseFloat(item.percentage));
  const colors = data.map((item) => item.color);
  const totalClicks = clicks
  const chartData = {
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderWidth: 0,
      },
    ],
  };
  const options = {
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        position: "average",
        displayColors: false,
        callbacks: {
          label: function (tooltipItem) {
            return `${data[tooltipItem.dataIndex].name}: ${values[tooltipItem.dataIndex]}%`;
          },
        },
      },
    },
    cutout: '60%'
  };


  return (
    <div className="relative flex justify-center items-center">
      <div className="absolute flex mt-[3px] flex-col justify-center items-center text-3xl font-bold border bg-[#F2CECE] rounded-full size-[120px]">
        <span className="text-black h-4 tracking-widest">{totalClicks}</span>
        <span className="text-[10px] m-2 text-gray-500 h-[10px]">Clicks</span>
      </div>
      
        <Doughnut className="relative z-0" data={chartData} options={options} />
      
    </div>
  );
};

export default PieChart;
