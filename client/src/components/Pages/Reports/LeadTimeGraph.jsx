import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const LeadTimeGraph = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded shadow-lg">
        <p className="text-gray-500">Nenhum dado encontrado para o gráfico.</p>
      </div>
    );
  }

  const categories = data.map((d) => d.component_name);
  const metaData = data.map((d) => Number(d.meta_hours) || 0);
  const realData = data.map((d) => Number(d.real_hours) || 0);

  // Ajuste: Aumentei um pouco o multiplicador para dar mais espaço entre as barras
  const containerWidth = categories.length > 10 ? `${categories.length * 70}px` : "100%";

  const barColors = data.map((d) => {
    const meta = Number(d.meta_hours) || 0;
    const real = Number(d.real_hours) || 0;
    return real > meta ? "#EF4444" : "#10B981"; 
  });

  const series = [
    { name: "Tempo Real", type: "column", data: realData },
    { name: "Meta (Lead Time)", type: "line", data: metaData },
  ];

  const options = {
    chart: {
      type: "line",
      stacked: false,
      toolbar: { show: true },
      zoom: { enabled: false },
    },
    stroke: {
      width: [0, 4],
      curve: "straight",
      dashArray: [0, 5],
    },
    title: {
      text: "Lead Time: Meta vs Real",
      align: "left",
      style: { fontSize: "14px", fontWeight: "bold", color: "#333" },
    },
    plotOptions: {
      bar: {
        columnWidth: "60%", // Barras um pouco mais largas
        borderRadius: 4,
        distributed: true, 
      },
    },
    colors: [...barColors, "#3B82F6"], 
    grid: {
        padding: {
            bottom: 20,
            left: 10,
            right: 10
        }
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1],
      formatter: (val) => val.toFixed(1),
      style: { fontSize: "10px", colors: ["#333"] },
      offsetY: -10,
    },
    xaxis: {
      categories: categories,
      labels: {
        style: { fontSize: "11px" },
        rotate: -45,
        trim: false,
        maxHeight: 100, 
      },
    },
    yaxis: {
      title: { text: "Horas (h)" },
      labels: { formatter: (val) => val.toFixed(0) },
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      customLegendItems: ["Tempo Real (Dentro)", "Tempo Real (Estourado)", "Meta"],
      markers: { fillColors: ["#10B981", "#EF4444", "#3B82F6"] },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: { formatter: (y) => (typeof y !== "undefined" ? y.toFixed(1) + " h" : y) },
    },
    markers: { size: 5, hover: { size: 7 } },
  };

  return (
    <div className="p-3 bg-white rounded shadow-lg h-full w-full flex flex-col">
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
        <div style={{ minWidth: containerWidth, height: "100%" }}>
          <Chart
            options={options}
            series={series}
            type="line"
            height="100%"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};

LeadTimeGraph.propTypes = {
  data: PropTypes.array,
};

export default LeadTimeGraph;