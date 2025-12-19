import React, { useEffect, useState } from "react";
import StatusButton from "../../Ui/StatusButton";
import { getEquipmentsTimelineByBudget } from "@services/ViewsSummary";

export default function ProjectTimeline({
  currentBudget,
  searchTerm,
  timelineTasks = [],
  timelineEquipments = [],
  timelineBudgets,
}) {
  const [timelineDates, setTimelineDates] = useState([]);
  const [equipmentsInBudgets, setEquipmentsInBudgets] = useState([]);
  useEffect(() => {
    const dateLoader = () => {
      const rawStartDate = timelineBudgets?.project_start_at;
      let startDate = rawStartDate ? new Date(rawStartDate) : new Date();
      if (isNaN(startDate.getTime())) startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      const rawEndDate = timelineBudgets?.project_end_at;
      let endDate = rawEndDate ? new Date(rawEndDate) : new Date();

      if (isNaN(endDate.getTime()) || endDate < startDate) {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 30);
      } else {
        endDate.setDate(endDate.getDate() + 30);
      }

      endDate.setHours(0, 0, 0, 0);

      const datesArray = [];
      let currentDate = new Date(startDate);
      let safety = 0;

      while (currentDate <= endDate && safety < 1000) {
        datesArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
        safety++;
      }

      setTimelineDates(datesArray);
    };

    const LoadData = async () => {
      if (!currentBudget) {
        console.error("Orçamento inválido");
        return;
      }

      const data = await getEquipmentsTimelineByBudget(currentBudget?.id);
      setEquipmentsInBudgets(data);
    };

    dateLoader();
    LoadData();
  }, [timelineBudgets, currentBudget]);

  // Função utilitária para verificar se a data está no range
  const isDateInRange = (date, startStr, endStr) => {
    if (!startStr || !endStr) return false;
    const current = new Date(date).setHours(0, 0, 0, 0);
    const start = new Date(startStr).setHours(0, 0, 0, 0);
    const end = new Date(endStr).setHours(0, 0, 0, 0);
    return current >= start && current <= end;
  };

  const formatDateHeader = (date) => {
    if (!date || isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  // Loading state simples
  if (!timelineEquipments) {
    return <div className="text-gray-500 p-4">Carregando dados...</div>;
  }

  return (
    <div className="w-full max-w-[calc(100vw-280px)] overflow-x-auto pb-4 border border-gray-200 rounded-lg">
      <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="sticky left-0 z-20 px-4 py-3 bg-gray-50 border-r border-gray-200 min-w-[200px]">
              Item
            </th>
            {timelineDates.map((date, index) => (
              <th
                key={index}
                className="px-2 py-3 min-w-[50px] text-center font-medium text-gray-500 border-r border-gray-100 last:border-0"
              >
                {formatDateHeader(date)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {equipmentsInBudgets
            .filter((equip) =>
              equip?.recipe_name
                ?.toLowerCase()
                ?.includes(searchTerm.toLowerCase())
            )
            .map((equip) => {
              const tasksDoEquipamento = timelineTasks.filter(
                (t) => t.equipment_recipe_id == equip.equipment_recipe_id
              );
              return (
                <React.Fragment key={equip.equipment_recipe_id}>
                  {/* LINHA DO EQUIPAMENTO */}
                  <tr className="border-b border-gray-100 bg-gray-50/30 hover:bg-gray-100 transition-colors">
                    <td className="sticky left-0 z-10 font-bold text-gray-800 bg-white border-r border-gray-200 px-4">
                      {equip.recipe_name}
                      {/* Use recipe_name ou equipment_name conforme sua view */}
                    </td>
                    {timelineDates.map((date, index) => (
                      <td
                        key={index}
                        className="text-center border-r border-gray-200/50 last:border-0 p-0 h-10"
                      >
                        {isDateInRange(
                          date,
                          equip?.equipment_start_at,
                          equip?.equipment_end_at
                        ) && <StatusButton status="Pending" />}
                      </td>
                    ))}
                  </tr>

                  {/* LINHAS DOS COMPONENTES (Filtradas) */}
                  {tasksDoEquipamento.map((comp) => {
                    return (
                      <tr
                        key={comp.task_id || comp.component_id} // Prefira task_id se vier da view de timeline
                        className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="sticky left-0 z-10 text-gray-600 bg-white border-r border-gray-200 px-4 pl-8">
                          <div className="flex items-center gap-2 text-xs">
                            {comp.component_name}
                          </div>
                        </td>
                        {timelineDates.map((date, index) => (
                          <td
                            key={index}
                            className="text-center border-r border-gray-100 last:border-0 p-0 h-8"
                          >
                            {isDateInRange(
                              date,
                              comp?.planned_start_at,
                              comp?.planned_end_at
                            ) && <StatusButton status="Pending" />}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
