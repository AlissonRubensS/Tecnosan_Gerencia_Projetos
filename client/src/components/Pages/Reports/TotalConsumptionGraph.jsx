import { useState } from "react";
import Chart from "react-apexcharts";

const TotalConsumptionGraph = ({ data = [] }) => {
  const [mode, setMode] = useState("kg");

  // Verifica se há dados válidos
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-white rounded-lg p-4 border border-gray-100">
        <p className="text-gray-400 text-sm">Sem dados de consumo para exibir.</p>
      </div>
    );
  }

  // 1. Extração de Categorias (Eixo X - Projetos) e Séries (Materiais)
  // Filtramos valores nulos ou vazios para evitar chaves undefined
  const projects = [...new Set(data.map((d) => d.project_name).filter(Boolean))];
  const materials = [...new Set(data.map((d) => d.material_name).filter(Boolean))];

  // Se após filtrar não sobrar nada, retorna aviso
  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-white rounded-lg p-4">
        <p className="text-gray-400 text-sm">Dados de projeto incompletos.</p>
      </div>
    );
  }

  // 2. Cálculo de Largura para Scroll Horizontal
  // Define 120px por coluna de projeto ou 100% da tela, o que for maior
  const minColumnWidth = 120; 
  const calculatedWidth = projects.length * minColumnWidth;
  // Se a largura calculada for muito pequena, usamos '100%' para preencher o container
  const containerWidth = calculatedWidth < 400 ? "100%" : `${calculatedWidth}px`;

  // 3. Montagem das Séries
  const series = materials.map((material) => ({
    name: material,
    data: projects.map((project) => {
      const item = data.find(
        (d) => d.project_name === project && d.material_name === material
      );
      
      // Proteção contra valores nulos/undefined
      if (!item) return 0;

      const val = mode === "kg" ? item.total_material_consumed : item.total_value;
      return Number(val) || 0; // Garante que retorne número, mesmo se a API mandar string
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
        horizontal: false, // FALSE = Barras Verticais (Em pé)
        columnWidth: "50%",
        borderRadius: 2,
        dataLabels: {
          total: {
            enabled: true,
            offsetY: -20,
            style: { fontSize: "10px", fontWeight: 700, color: "#333" },
            formatter: (val) => {
              if (val <= 0) return "";
              return mode === "kg"
                ? `${val.toFixed(0)}`
                : `R$${val.toLocaleString("pt-BR", { notation: "compact" })}`;
            },
          },
        },
      },
    },
    xaxis: {
      categories: projects,
      labels: {
        style: { fontSize: "11px", colors: "#555", fontWeight: 500 },
        rotate: -45, // Inclina rótulos para caber nomes longos
        rotateAlways: false,
        hideOverlappingLabels: false,
        trim: false,
        maxHeight: 120, // Aumenta espaço para labels inclinados
      },
      axisBorder: { show: true, color: "#e5e7eb" },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "10px", colors: "#666" },
        formatter: (val) => {
          if (mode === "reais")
            return `R$ ${val.toLocaleString("pt-BR", { notation: "compact" })}`;
          return val.toFixed(0);
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "11px",
      markers: { radius: 12 },
    },
    dataLabels: { enabled: false },
    
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
    <div className="h-full w-full flex flex-col p-2 bg-white rounded-lg">
      {/* Header com Botões */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Visualização
        </span>
        <div className="flex bg-gray-100 rounded p-0.5">
          <button
            onClick={() => setMode("kg")}
            className={`px-3 py-1 text-[10px] rounded font-semibold transition-colors ${
              mode === "kg"
                ? "bg-white text-green-700 shadow-sm ring-1 ring-green-100"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            KG
          </button>
          <button
            onClick={() => setMode("reais")}
            className={`px-3 py-1 text-[10px] rounded font-semibold transition-colors ${
              mode === "reais"
                ? "bg-white text-green-700 shadow-sm ring-1 ring-green-100"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            R$
          </button>
        </div>
      </div>

      {/* Container do Gráfico com Scroll Horizontal */}
      {/* flex-1 garante que ocupe a altura restante. overflow-x-auto permite rolagem lateral */}
      <div className="flex-1 w-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-transparent pb-2">
        <div style={{ width: containerWidth, minWidth: "100%", height: "100%" }}>
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