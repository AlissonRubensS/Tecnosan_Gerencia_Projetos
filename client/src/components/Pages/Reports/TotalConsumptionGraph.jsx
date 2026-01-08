import { useState } from "react";
import Chart from "react-apexcharts";

const TotalConsumptionGraph = ({ data = [] }) => {
  const [mode, setMode] = useState("kg");

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-2xl shadow-sm">
        <p className="text-gray-400 text-sm">Carregando dados...</p>
      </div>
    );
  }

  const projects = [...new Set(data.map((d) => d.project_name))];
  const materials = [...new Set(data.map((d) => d.material_name))];
  // Aumentei um pouquinho a altura por item para ficar mais espaçado
  const chartHeight = Math.max(350, projects.length * 60);

  const series = materials.map((material) => ({
    name: material,
    data: projects.map((project) => {
      const item = data.find(
        (d) => d.project_name === project && d.material_name === material
      );
      return item
        ? mode === "kg"
          ? Number(item.total_material_consumed)
          : Number(item.total_value)
        : 0;
    }),
  }));

  const options = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: true },
      zoom: { enabled: true, type: "xy" },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "40%",
        borderRadius: 4,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "11px",
              fontWeight: 600,
              color: "#333",
            },
            formatter: (val) => {
              if (val < 1) return "";
              return mode === "kg"
                ? `${val.toFixed(0)} kg`
                : `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
            },
          },
        },
      },
    },
    xaxis: {
      labels: {
        style: { fontSize: "11px", colors: "#333" },
        formatter: (val) => {
          if (val < 1) return val.toFixed(0);
          return mode === "kg"
            ? `${val.toFixed(0)}`
            : `R$ ${val.toLocaleString("pt-BR")}`;
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      categories: projects,
      labels: {
        style: { fontSize: "11px", colors: "#333" },
        maxWidth: 160, // Limita largura do texto do projeto para não espremer o gráfico
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontSize: "11px",
      markers: { radius: 4 },
    },
    dataLabels: { enabled: false },
    colors: ["#4B0082", "#6495ED", "#32CD32", "#87CEFA", "#9370DB"],
    tooltip: {
      y: {
        formatter: (val) =>
          mode === "kg"
            ? `${val.toFixed(0)} kg`
            : `R$ ${val.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
      },
    },
    grid: { borderColor: "transparent" },
  };

  return (
    <div className="p-3 bg-white rounded-2xl shadow-sm h-full w-full flex flex-col">
      {/* Título e Botões (seção fixa) */}
      <div className="flex items-center justify-between mb-3 font-medium">
        <span className="text-gray-700">Consumo Total</span>
        
        <div className="flex gap-1 border rounded-lg overflow-hidden bg-gray-50">
          <button
            onClick={() => setMode("kg")}
            className={`px-3 py-1 text-xs transition ${
              mode === "kg"
                ? "bg-sky-200 text-sky-900 font-semibold"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Qtd (kg)
          </button>
          <button
            onClick={() => setMode("reais")}
            className={`px-3 py-1 text-xs transition ${
              mode === "reais"
                ? "bg-sky-200 text-sky-900 font-semibold"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Valor (R$)
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar pr-2 pb-2">
        <div style={{ minWidth: "600px", height: chartHeight }}>
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