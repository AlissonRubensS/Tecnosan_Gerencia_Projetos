import { useState } from "react";
import Chart from "react-apexcharts";

const TotalConsumptionGraph = ({ data = [] }) => {
  const [mode, setMode] = useState("kg");

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-50 rounded border border-dashed border-gray-200">
        <p className="text-gray-400 text-sm">Sem dados de consumo.</p>
      </div>
    );
  }

  const projects = [
    ...new Set(data.map((d) => d.project_name).filter(Boolean)),
  ];
  const materials = [
    ...new Set(data.map((d) => d.material_name).filter(Boolean)),
  ];

  if (projects.length === 0) return null;

  const calculatedWidth = projects.length * 100;
  const containerWidth =
    calculatedWidth < 400 ? "100%" : `${calculatedWidth}px`;

  const series = materials.map((material) => ({
    name: material,
    data: projects.map((project) => {
      const item = data.find(
        (d) => d.project_name === project && d.material_name === material,
      );
      if (!item) return 0;
      return mode === "kg"
        ? Number(item.total_material_consumed || 0)
        : Number(item.total_value || 0);
    }),
  }));

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
        columnWidth: "50%",
        borderRadius: 2,
        dataLabels: {
          total: {
            enabled: true,
            offsetY: -20,
            style: { fontSize: "10px", fontWeight: 700, color: "#333" },
            formatter: (val) =>
              val <= 0
                ? ""
                : mode === "kg"
                  ? `${val.toFixed(0)}`
                  : `R$${val.toLocaleString("pt-BR", { notation: "compact" })}`,
          },
        },
      },
    },
    xaxis: {
      categories: projects,
      labels: {
        style: { fontSize: "11px", colors: "#555", fontWeight: 500 },
        rotate: -45,
        maxHeight: 120,
      },
      axisBorder: { show: true, color: "#e5e7eb" },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "10px", colors: "#666" },
        formatter: (val) =>
          mode === "reais"
            ? `R$ ${val.toLocaleString("pt-BR", { notation: "compact" })}`
            : val.toFixed(0),
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "11px",
      markers: { radius: 12 },
    },
    dataLabels: { enabled: false },
    colors: [
      "#8B5CF6",
      "#3B82F6",
      "#F97316",
      "#10B981",
      "#EC4899",
      "#6366F1",
      "#EAB308",
    ],
    tooltip: {
      theme: "light",
      y: {
        formatter: (val) =>
          mode === "kg"
            ? `${Number(val).toFixed(2)} kg`
            : `R$ ${Number(val).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      },
    },
    grid: {
      borderColor: "#f3f4f6",
      padding: { top: 0, right: 0, bottom: 0, left: 10 },
    },
  };

  return (
    // Removido bg-white e p-2. Agora usa o estilo do pai.
    <div className="h-full w-full flex flex-col">
      <div className="flex items-center justify-end mb-2 shrink-0">
        <div className="flex bg-gray-100 rounded p-0.5">
          <button
            onClick={() => setMode("kg")}
            className={`px-3 py-1 text-[10px] rounded font-semibold transition-colors ${mode === "kg" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
          >
            KG
          </button>
          <button
            onClick={() => setMode("reais")}
            className={`px-3 py-1 text-[10px] rounded font-semibold transition-colors ${mode === "reais" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
          >
            R$
          </button>
        </div>
      </div>
      <div className="flex-1 w-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2">
        <div
          style={{ width: containerWidth, minWidth: "100%", height: "100%" }}
        >
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

export default TotalConsumptionGraph;
