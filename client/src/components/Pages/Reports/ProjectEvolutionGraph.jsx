import Chart from "react-apexcharts";

const ProjectEvolutionGraph = ({ categories = [], series = [] }) => {
  const hasData = categories.length > 0 && series.length > 0;

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-50 rounded border border-dashed border-gray-200">
        <p className="text-gray-400 text-sm">Sem dados para exibir.</p>
      </div>
    );
  }

  // Largura Dinâmica
  const calculatedWidth = categories.length * 70;
  const chartWidth = calculatedWidth > 600 ? `${calculatedWidth}px` : "100%";

  const options = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 3,
        dataLabels: {
          total: {
            enabled: true,
            offsetY: -20,
            style: { fontSize: "10px", fontWeight: 700, color: "#444" },
          },
        },
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: { fontSize: "10px", colors: "#666" },
        rotate: -45,
        trim: true,
        maxHeight: 80,
      },
      axisBorder: { show: true, color: "#e5e7eb" },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { fontSize: "10px", colors: "#333", fontWeight: 500 } },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "11px",
      markers: { radius: 12 },
    },
    grid: {
      borderColor: "#f3f4f6",
      padding: { top: 0, right: 10, bottom: 0, left: 0 },
    }, // Left 0 para alinhar melhor
    dataLabels: { enabled: false },
    colors: ["#5EED9A", "#E2E8F0"], // Verde Claro e Cinza Suave
    tooltip: { theme: "light", y: { formatter: (val) => `${val} un.` } },
  };

  return (
    // Removido padding interno (p-2) para evitar duplicidade com o pai
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div style={{ width: chartWidth, height: "100%", minHeight: "300px" }}>
          <Chart
            options={options}
            series={series}
            type="bar"
            height="100%"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectEvolutionGraph;
