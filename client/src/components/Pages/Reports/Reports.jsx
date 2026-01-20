import { useState, useEffect, useCallback, useMemo } from "react";

// UI Components
import NavBar from "../../Ui/NavBar";
import CascadeTable from "../../Ui/CascadeTable";
import CascadeTableTwoLevel from "../../Ui/CascadeTableTwoLevel";
import InfoCard from "../../Ui/InfoCard";
import SelectMenu from "../../Ui/SelectMenu";
import ProjectEvolutionGraph from "./ProjectEvolutionGraph";
import TotalConsumptionGraph from "./TotalConsumptionGraph";
import LeadTimeGraph from "./LeadTimeGraph";

// Services
import { listProjects } from "@services/ProjectService";
import { getEquipment } from "@services/EquipmentService";
import { VerifyAuth } from "@services/AuthService";
import {
  countStatusComponents,
  countStatusComponentsByProj,
} from "@services/ComponentsServices";
import {
  vwProjectConsumedMaterials,
  vwProjectDepartmentDelays,
} from "@services/ViewsService";
import { getLeadTimeVsReal } from "@services/ComponentsServices";

// Utils
import {
  getDefaultDateRange,
  formatDateForApi,
} from "../../../utils/dateUtils";

import entrega from "@imgs/entrega.png";
import caixa from "@imgs/caixa.png";

export default function Reports() {
  // --- Estados de Filtros ---
  const defaultDates = getDefaultDateRange(3);
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);
  
  const [selectedProj, setSelectedProj] = useState([]);
  const [selectedEquip, setSelectedEquip] = useState([]);
  
  const [currentUserId, setCurrentUserId] = useState(null);

  // --- Estados de Dados (Listas) ---
  const [projects, setProjects] = useState([]);
  const [equipments, setEquipments] = useState([]);

  // --- Estados de Dados (Métricas) ---
  const [dataConsumedMaterials, setDataConsumedMaterials] = useState([]);
  const [processDelaysList, setProcessDelaysList] = useState([]);
  const [countStatusGraph, setCountStatusGraph] = useState([]); // Dados brutos
  const [metrics, setMetrics] = useState({ completed: 0, pending: 0 });
  const [leadTimeData, setLeadTimeData] = useState([]);

  // ---------------------------------------------------------
  // LÓGICA DE PROCESSAMENTO DE DADOS (Atualizada para Pending, Running, Completed, Failed)
  // ---------------------------------------------------------
  const evolutionChartData = useMemo(() => {
    if (!countStatusGraph || countStatusGraph.length === 0) {
      return { categories: [], series: [] };
    }

    const equipmentMap = new Map();

    countStatusGraph.forEach((item) => {
      const equipName = item.equipment_name;
      const qtd = Number(item.numero_pecas) || 0;
      // Garante que a comparação seja segura (remove espaços extras)
      const status = (item.status || "").trim();

      if (!equipmentMap.has(equipName)) {
        equipmentMap.set(equipName, { entregues: 0, pendentes: 0 });
      }

      const entry = equipmentMap.get(equipName);

      // --- REGRA ATUALIZADA ---
      // Classes do Banco: Pending, Running, Completed, Failed
      if (status === "Completed") {
        entry.entregues += qtd;
      } else {
        // Se for Pending, Running ou Failed, cai aqui
        entry.pendentes += qtd;
      }
    });

    const categories = Array.from(equipmentMap.keys());
    
    const series = [
      {
        name: "Entregues",
        data: categories.map((cat) => equipmentMap.get(cat).entregues),
      },
      {
        name: "Pendentes",
        data: categories.map((cat) => equipmentMap.get(cat).pendentes),
      },
    ];

    return { categories, series };
  }, [countStatusGraph]);

  // ---------------------------------------------------------

  // 1. Carregamento Inicial
  useEffect(() => {
    let isMounted = true;
    const fetchOptionsData = async () => {
      try {
        const user = await VerifyAuth();
        if (!user) return;

        if (isMounted) setCurrentUserId(user.user_id);

        const [projData, equipData] = await Promise.all([
          listProjects(user.user_id),
          getEquipment(user.user_id),
        ]);

        if (isMounted) {
          setProjects(projData || []);
          setEquipments(equipData || []);
        }
      } catch (error) {
        console.error("Erro ao carregar opções iniciais:", error);
      }
    };
    fetchOptionsData();
    return () => { isMounted = false; };
  }, []);

  // 2. Busca de Métricas
  const fetchDashboardMetrics = useCallback(async () => {
    if (!currentUserId) return;

    const projId = selectedProj.length > 0 ? selectedProj[0] : null;
    const equipId = selectedEquip.length > 0 ? selectedEquip[0] : null;

    try {
      const formattedStart = formatDateForApi(startDate);
      const formattedEnd = formatDateForApi(endDate);

      const [
        graphResponse,
        cardsResponse,
        leadTimeResponse,
        materialDataRaw,
        delayDataRaw
      ] = await Promise.all([
        countStatusComponentsByProj(projId, equipId, formattedStart, formattedEnd),
        countStatusComponents(projId, equipId, formattedStart, formattedEnd),
        getLeadTimeVsReal(projId, equipId, formattedStart, formattedEnd),
        vwProjectConsumedMaterials(currentUserId, projId, formattedStart, formattedEnd),
        vwProjectDepartmentDelays(projId)
      ]);

      setCountStatusGraph(graphResponse || []);
      setLeadTimeData(leadTimeResponse || []);

      if (cardsResponse && cardsResponse[0]) {
        setMetrics({
          completed: cardsResponse[0].total_completed || 0,
          pending: cardsResponse[0].total_pending || 0,
        });
      } else {
        setMetrics({ completed: 0, pending: 0 });
      }

      if (Array.isArray(materialDataRaw)) {
        if (projId) {
            const filtered = materialDataRaw.filter(m => m.project_id === projId);
            setDataConsumedMaterials(filtered);
        } else {
            setDataConsumedMaterials(materialDataRaw);
        }
      } else {
        setDataConsumedMaterials([]);
      }

      setProcessDelaysList(delayDataRaw || []);

    } catch (error) {
      console.error("Erro ao atualizar métricas:", error);
    }
  }, [selectedProj, selectedEquip, startDate, endDate, currentUserId]);

  useEffect(() => {
    fetchDashboardMetrics();
  }, [fetchDashboardMetrics]);

  const uniqueMaterialNames = [
    ...new Set(dataConsumedMaterials.map((p) => p.material_name))
  ].filter(Boolean);

  return (
    <div className="h-screen w-screen space-y-4 pb-16 bg-gray-50 overflow-x-hidden">
      <NavBar select_index={3} />

      {/* --- HEADER DE FILTROS --- */}
      <div className="flex flex-row bg-white py-2 px-4 items-center justify-between shadow-md mx-4 rounded-lg border-l-4 border-green-500">
        <h2 className="font-bold text-lg text-gray-800">Dashboard</h2>

        <div className="flex flex-row space-x-4 items-end">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">Projetos</p>
            <SelectMenu
              className="h-7 w-40"
              maxSelections={1}
              options={projects.map((p) => ({
                id: p.project_id,
                label: p.project_name,
              }))}
              selectedOption={selectedProj}
              setSelectedOption={setSelectedProj}
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">Equipamento</p>
            <SelectMenu
              className="h-7 w-40"
              maxSelections={1}
              options={equipments.map((e) => ({
                id: e.equipment_id,
                label: e.equipment_name,
              }))}
              selectedOption={selectedEquip}
              setSelectedOption={setSelectedEquip}
            />
          </div>
          <div className="flex flex-col">
            <p className="self-center text-xs font-semibold text-gray-500 mb-1 uppercase">Período</p>
            <div className="flex flex-row space-x-2">
              <input
                type="date"
                className="bg-gray-50 px-2 py-1 rounded border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700 font-medium"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="bg-gray-50 px-2 py-1 rounded border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700 font-medium"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- GRID --- */}
      <div className="grid grid-cols-12 gap-4 mx-4">
        
        {/* Linha 1: Cards + Gráfico Principal */}
        <div className="col-span-7 bg-white p-4 rounded-lg shadow-md border-t-2 border-green-100 flex flex-row">
          <div className="flex flex-col space-y-6 w-1/4 pr-4 justify-center">
            <InfoCard
              title="Entregues"
              value={metrics.completed}
              icon={<img src={entrega} className="w-8 h-8 opacity-90" alt="Entregues" />}
            />
            <InfoCard
              title="Peças Pendentes"
              value={metrics.pending}
              icon={<img src={caixa} className="w-8 h-8 opacity-90" alt="Pendentes" />}
            />
          </div>
          <div className="w-3/4 pl-4 h-full">
            <ProjectEvolutionGraph 
                categories={evolutionChartData.categories}
                series={evolutionChartData.series}
            />
          </div>
        </div>

        {/* Linha 1: Tabela de Materiais */}
        <div className="col-span-5 h-96 bg-white p-3 rounded-lg shadow-md border-t-2 border-green-100 overflow-hidden flex flex-col">
          <h3 className="text-sm font-bold text-gray-700 mb-2 pl-2 border-l-4 border-green-400">
             Detalhamento por Projeto
          </h3>
          <div className="flex-1 overflow-hidden">
            <CascadeTable
                headers={["Equipamentos", "Valores"]}
                filter={uniqueMaterialNames}
                values={dataConsumedMaterials}
            />
          </div>
        </div>

        {/* Linha 2: Consumo Total */}
        <div className="col-span-4 h-96 bg-white p-3 rounded-lg shadow-md border-t-2 border-green-100 flex flex-col">
          <h3 className="text-sm font-bold text-gray-700 mb-2 pl-2 border-l-4 border-green-400 shrink-0">
             Consumo Total
          </h3>
          <div className="flex-1 min-h-0 w-full">
             <TotalConsumptionGraph data={dataConsumedMaterials} />
          </div>
        </div>

        {/* Linha 2: Lead Time */}
        <div className="col-span-4 h-96 bg-white p-3 rounded-lg shadow-md border-t-2 border-green-100 overflow-hidden">
          <h3 className="text-sm font-bold text-gray-700 mb-2 pl-2 border-l-4 border-green-400">
             Lead Time (Real vs Previsto)
          </h3>
          <div className="h-[90%] w-full">
             <LeadTimeGraph data={leadTimeData} />
          </div>
        </div>

        {/* Linha 2: Atrasos */}
        <div className="col-span-4 h-96 bg-white p-3 rounded-lg shadow-md border-t-2 border-green-100 overflow-y-auto">
          <h3 className="text-sm font-bold text-gray-700 mb-2 pl-2 border-l-4 border-red-400">
             Processos em Atraso
          </h3>
          <CascadeTableTwoLevel
            title=""
            data={processDelaysList.map((data) => ({
              component_id: data.component_id,
              component_name: data.component_name,
              department_id: data.department_id,
              department_name: data.department_name,
              days_late: data.total_delay_time?.days || 0,
            }))}
          />
        </div>
      </div>
    </div>
  );
}