import Chart from "react-apexcharts";

const ProjectStatusStackedChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded shadow-lg p-4">
        <p className="text-gray-500 text-sm">Aguardando dados...</p>
      </div>
    );
  }

  const categories = [...new Set(data.map((d) => d.equipment_name))];
  const statuses = [...new Set(data.map((d) => d.status))];

  // CÁLCULO DE ALTURA DINÂMICA (Para Scroll Vertical)
  // Define 45px de altura para cada equipamento. Mínimo de 300px total.
  const chartHeight = Math.max(300, categories.length * 45);

  const series = statuses.map((status) => ({
    name: status,
    data: categories.map((cat) => {
      const item = data.find(
        (d) => d.equipment_name === cat && d.status === status
      );
      return item ? Number(item.numero_pecas) : 0;
    }),
  }));

  const options = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: true },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: true, // MUDANÇA: Barras deitadas
        barHeight: "60%", // Espessura da barra
        borderRadius: 2,
        dataLabels: {
           total: {
             enabled: true, // Mostra o total somado na ponta da barra
             style: { fontSize: '11px', fontWeight: 600, color: '#444' }
           }
        }
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: { fontSize: "11px", colors: "#666" },
        formatter: (val) => val.toFixed(0), // Números inteiros no eixo X
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      // MUDANÇA: Os nomes dos equipamentos agora ficam no Eixo Y (Esquerda)
      labels: {
        style: { fontSize: "11px", colors: "#333", fontWeight: 500 },
        maxWidth: 160, // Limita a largura do texto para não espremer o gráfico
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontSize: "12px",
      markers: { radius: 5 },
      itemMargin: { horizontal: 10, vertical: 0 }
    },
    grid: {
      borderColor: "transparent",
      padding: {
        top: 0,
        right: 25, // Espaço para o label de total não cortar
        bottom: 0,
        left: 10
      }
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: "10px", colors: ["#000"] },
      formatter: (val) => (val > 0 ? val : ""), // Oculta o "0" dentro da barra
    },
    colors: ["#5EED9A", "#F3F4F7"], // Mantive suas cores (Verde e Cinza)
    tooltip: {
      y: {
        formatter: (val) => `${val} componentes`,
      },
    },
  };

  return (
    <div className="p-3 h-full w-full flex flex-col">
      <div className="mb-2 px-1 flex justify-between items-center">
        <h3 className="font-bold text-gray-700 text-sm">Status por Equipamento</h3>
      </div>

      {/* MUDANÇA: overflow-y-auto (Rolagem Vertical)
         pr-2: Padding na direita para a scrollbar não colar no gráfico
      */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pr-2">
        <div style={{ height: chartHeight, minHeight: '100%' }}>
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

export default ProjectStatusStackedChart;