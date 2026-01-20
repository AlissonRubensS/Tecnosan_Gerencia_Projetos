import Chart from "react-apexcharts";

const ProjectEvolutionGraph = ({ categories = [], series = [] }) => {
  // Verifica se temos dados para renderizar
  const hasData = categories.length > 0 && series.length > 0;

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-lg p-4 border border-gray-100">
        <p className="text-gray-400 text-sm">Aguardando dados...</p>
      </div>
    );
  }

  // Cálculo de Largura Dinâmica (Scroll Horizontal) - Responsabilidade de UI
  const pixelPerColumn = 70;
  const calculatedWidth = categories.length * pixelPerColumn;
  const chartWidth = calculatedWidth > 500 ? `${calculatedWidth}px` : "100%";

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
        horizontal: false, // Vertical
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
      labels: {
        style: { fontSize: "10px", colors: "#333", fontWeight: 500 },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "11px",
      markers: { radius: 12 },
    },
    grid: {
      borderColor: "#f3f4f6",
      padding: { top: 0, right: 10, bottom: 0, left: 10 },
    },
    dataLabels: { enabled: false },
    
    // CORES:
    // 0: Entregues (Verde Claro Vibrante - #5EED9A)
    // 1: Pendentes (Cinza Azulado Suave - #CBD5E1)
    colors: ["#5EED9A", "#CBD5E1"],
    
    tooltip: {
      theme: "light",
      y: { formatter: (val) => `${val} un.` },
    },
  };

  return (
    <div className="h-full w-full flex flex-col p-2">
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-2 scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-transparent">
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