import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const LeadTimeGraph = ({ data = [] }) => {
  // Verificação de dados vazios com estilo padronizado (tracejado)
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-50 rounded border border-dashed border-gray-200">
        <p className="text-gray-400 text-sm">Nenhum dado encontrado para o gráfico.</p>
      </div>
    );
  }

  const categories = data.map((d) => d.component_name);
  const metaData = data.map((d) => Number(d.meta_hours) || 0);
  const realData = data.map((d) => Number(d.real_hours) || 0);

  // Cálculo de largura dinâmica para scroll horizontal
  // 70px por barra garante espaço suficiente para leitura
  const calculatedWidth = categories.length * 70;
  const containerWidth = calculatedWidth > 500 ? `${calculatedWidth}px` : "100%";

  // Lógica de Cores: Verde se (Real <= Meta), Vermelho se (Real > Meta)
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
      toolbar: { show: false }, // Toolbar removida para limpar visual
      zoom: { enabled: false },
      fontFamily: "inherit",
    },
    stroke: {
      width: [0, 3], // 0 para a coluna, 3 para a linha
      curve: "straight",
      dashArray: [0, 5], // Linha tracejada para a Meta
    },
    // Título removido, pois o Reports.jsx já tem o H3 no card
    title: {
      text: undefined, 
    },
    plotOptions: {
      bar: {
        columnWidth: "60%",
        borderRadius: 3,
        distributed: true, // Necessário para colorir cada barra individualmente (Verde/Vermelho)
      },
    },
    // Combina as cores das barras com a cor da linha (Azul) no final
    colors: [...barColors, "#3B82F6"], 
    grid: {
      borderColor: "#f3f4f6",
      padding: { bottom: 10, left: 10, right: 10 }
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1], // Mostra labels em ambas as séries
      formatter: (val) => val.toFixed(1),
      style: { fontSize: "10px", colors: ["#444"] },
      offsetY: -10,
    },
    xaxis: {
      categories: categories,
      labels: {
        style: { fontSize: "10px", colors: "#666" },
        rotate: -45,
        trim: false,
        maxHeight: 100, 
      },
      axisBorder: { show: true, color: "#e5e7eb" },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { 
        style: { fontSize: "10px", colors: "#666" },
        formatter: (val) => val.toFixed(0) 
      },
      title: { 
          text: "Horas (h)",
          style: { fontSize: "10px", fontWeight: 400, color: "#999" }
      }
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontSize: "11px",
      // Customização necessária porque 'distributed: true' esconde a legenda padrão da série de barras
      showForSingleSeries: true,
      customLegendItems: ["No Prazo", "Atrasado", "Meta"],
      markers: { fillColors: ["#10B981", "#EF4444", "#3B82F6"], radius: 12 },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: "light",
      y: { formatter: (y) => (typeof y !== "undefined" ? y.toFixed(1) + " h" : y) },
    },
    markers: { size: 4, hover: { size: 6 } },
  };

  return (
    // Container limpo, ocupando 100% da altura disponível no pai
    <div className="h-full w-full flex flex-col">
      {/* Scroll Wrapper com as classes padronizadas */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div style={{ minWidth: containerWidth, height: "100%", minHeight: "250px" }}>
          <Chart
            options={options}
            series={series}
            type="line" // Tipo principal
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