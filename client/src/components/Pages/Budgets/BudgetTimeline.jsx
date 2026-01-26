import React, { useMemo } from "react";
import StatusButton from "../../Ui/StatusButton";

export default function BudgetTimeline({
  currentBudget,
  // allBudgets removido pois não estava sendo usado (timelineBudgets já traz as datas)
  searchTerm = "",
  timelineTasks = [],
  timelineEquipments = [],
  timelineBudgets = [],
}) {
  
  // 1. LÓGICA: Encontrar o orçamento atual
  const currentBudgetTimeline = useMemo(() => {
    return timelineBudgets.find((b) => b.budget_id === currentBudget?.id);
  }, [timelineBudgets, currentBudget]);

  // 2. LÓGICA: Geração das datas
  // Se tem currentBudget, pega só dele. Se não, pega Min/Max de todos usando timelineBudgets.
  const { startDate, endDate } = useMemo(() => {
    let start, end;

    if (currentBudget?.id) {
        if (currentBudgetTimeline?.project_start_at) {
            start = new Date(currentBudgetTimeline.project_start_at);
            end = currentBudgetTimeline.project_end_at ? new Date(currentBudgetTimeline.project_end_at) : new Date(start);
        }
    } else {
        // Visão Global
        if (timelineBudgets.length > 0) {
            const starts = timelineBudgets.map(b => b.project_start_at ? new Date(b.project_start_at).getTime() : null).filter(Boolean);
            const ends = timelineBudgets.map(b => b.project_end_at ? new Date(b.project_end_at).getTime() : null).filter(Boolean);
            
            if (starts.length > 0) {
                start = new Date(Math.min(...starts));
                // Se não tiver data final, usa data atual + 30 dias como fallback
                const maxEnd = ends.length > 0 ? Math.max(...ends) : start.getTime() + (30 * 24 * 60 * 60 * 1000);
                end = new Date(maxEnd);
            }
        }
    }

    // Fallback se não encontrar datas
    if (!start) {
        start = new Date();
        end = new Date();
        end.setDate(end.getDate() + 30);
    }

    return { startDate: start, endDate: end };
  }, [currentBudget, currentBudgetTimeline, timelineBudgets]);

  // 3. LÓGICA: Gerar array de dias
  const timelineDates = useMemo(() => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    s.setHours(0,0,0,0);
    e.setHours(0,0,0,0);

    if (e < s) e.setDate(e.getDate() + 30);

    const dates = [];
    let curr = new Date(s);
    let safety = 0;

    // Limite de segurança para não travar o navegador
    while (curr <= e && safety < 500) {
      dates.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
      safety++;
    }
    return dates;
  }, [startDate, endDate]);

  // 4. Verificação de Intervalo
  const isDateInRange = (date, startStr, endStr) => {
    if (!startStr || !endStr) return false;
    
    const checkTime = date.getTime();
    const s = new Date(startStr); s.setHours(0, 0, 0, 0);
    const e = new Date(endStr); e.setHours(0, 0, 0, 0);

    return checkTime >= s.getTime() && checkTime <= e.getTime();
  };

  const formatDateHeader = (date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  // 5. Filtragem dos Equipamentos
  const filteredEquipments = useMemo(() => {
      let list = timelineEquipments;

      // Se tiver orçamento selecionado, filtra por ele.
      if (currentBudget?.id) {
          list = list.filter(e => e.budget_id === currentBudget.id);
      }

      if (searchTerm) {
          list = list.filter(equip => equip?.recipe_name?.toLowerCase()?.includes(searchTerm.toLowerCase()));
      }
      return list;
  }, [timelineEquipments, currentBudget, searchTerm]);


  if (timelineDates.length === 0) {
    return <div className="text-gray-500 p-4">Carregando cronograma...</div>;
  }

  return (
    <div 
      className="w-full max-w-[calc(100vw-280px)] overflow-x-auto pb-4 border border-gray-200 rounded-lg 
      [&::-webkit-scrollbar]:h-2 
      [&::-webkit-scrollbar]:w-2 
      [&::-webkit-scrollbar-track]:bg-[#f1f1f1] 
      [&::-webkit-scrollbar-track]:rounded 
      [&::-webkit-scrollbar-thumb]:bg-slate-300 
      [&::-webkit-scrollbar-thumb]:rounded 
      [&::-webkit-scrollbar-thumb]:hover:bg-slate-400"
    >
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
          {filteredEquipments.map((equip) => {
              const tasksDoEquipamento = timelineTasks.filter(
                (t) => t.equipment_recipe_id == equip.equipment_recipe_id
              );

              return (
                <React.Fragment key={equip.equipment_recipe_id}>
                  {/* LINHA DO EQUIPAMENTO */}
                  <tr className="border-b border-gray-100 bg-gray-50/30 hover:bg-gray-100 transition-colors">
                    <td className="sticky left-0 z-10 font-bold text-gray-800 bg-white border-r border-gray-200 px-4">
                      {equip.recipe_name}
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

                  {/* LINHAS DOS COMPONENTES */}
                  {tasksDoEquipamento.map((comp) => (
                    <tr
                      key={comp.task_id}
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
                  ))}
                </React.Fragment>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}