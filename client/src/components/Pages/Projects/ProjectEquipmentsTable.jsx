import React, { useEffect, useState, useMemo, useContext } from "react";
import {
  vwProjectMaterialsSummary,
  vwSummaryStatus,
} from "@services/ViewsSummary.js";
import { VerifyAuth } from "@services/AuthService.js";
import {
  updateStatus,
  updateCompletionDate,
} from "@services/ComponentsServices.js";

import { selectedProjectContext } from "@content/SeletedProject.jsx";
import { formatDateForInput } from "@utils/dateUtils.js";

import SelectMenu from "../../Ui/SelectMenu.jsx";

// --- Funções Auxiliares (INTOCADAS) ---
function TotalEquipmentMaterial(equipment) {
  if (!equipment?.components) return {};
  const totals = {};
  equipment.components.forEach((comp) => {
    comp.materials.forEach((mat) => {
      if (!totals[mat.material_id]) {
        totals[mat.material_id] = {
          id: mat.material_id,
          name: mat.material_name,
          qtd: Number(mat.total_material_consumed),
          value: Number(mat.total_value),
        };
      } else {
        totals[mat.material_id].qtd += Number(mat.total_material_consumed);
        totals[mat.material_id].value += Number(mat.total_value);
      }
    });
  });
  return totals;
}

function formatDateTime(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function sumEquipmentValue(equip_totals) {
  return Object.values(equip_totals)
    .reduce((sum, mat) => sum + Number(mat.value), 0)
    .toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function isExpanded(rowsExpands, id) {
  return rowsExpands.includes(id);
}

function renderMaterialColumns(
  equip_totals,
  materialIds = [1, 2, 3, 4, 5, 6, 7]
) {
  return materialIds.map((id) => (
    <th key={id}>{equip_totals[id]?.qtd?.toFixed(2) ?? 0}</th>
  ));
}

function statusLabel(status) {
  switch (status) {
    case "Pending": return "Pendente";
    case "Completed": return "Concluído";
    case "Running": return "Em Andamento";
    case "Delayed": return "Atrasado";
    case "Failed": return "Não Concluído";
    default: return "Sem Status";
  }
}

// --- Renderização dos Componentes ---
function renderComponentRow(
  components,
  compTimes,
  statusComponents,
  onStatusChange,
  onDateChange,
  updatingId
) {
  const statusOptions = [
    { id: "Pending", label: "Pendente" },
    { id: "Completed", label: "Concluído" },
    { id: "Running", label: "Em Andamento" },
    { id: "Delayed", label: "Atrasado" },
    { id: "Failed", label: "Não Concluído" },
    { id: "No Status", label: "Sem Status" },
  ];
  return components.map((comp, index) => {
    const bg_color = index % 2 === 0 ? "bg-gray-50" : "bg-gray-100";
    const time = compTimes[comp?.component_id] || {};

    const rawStatus = statusComponents?.find(
      (c) => c.component_id === comp.component_id
    )?.status;
    const currentStatusId = rawStatus || "No Status";

    const isSaving = updatingId === comp.component_id;
    const currentBorder = isSaving 
        ? "border-yellow-500 bg-yellow-50" 
        : "border-transparent hover:border-gray-300";

    return (
      <tr key={comp.component_id} className={bg_color}>
        <td>{comp.component_name}</td>
        <td>{formatDateTime(time?.planned_start)}</td>
        <td>{formatDateTime(time.real_start)}</td>
        <td className="text-gray-500 font-medium text-xs">
          {formatDateTime(time?.planned_end)}
        </td>
        <td>
          <input
            type="datetime-local"
            disabled={isSaving}
            className={`bg-transparent border ${currentBorder} rounded p-1 cursor-pointer w-full text-center text-xs`}
            key={`date-${comp.component_id}-${time.real_end}`}
            defaultValue={formatDateForInput(time.real_end)}
            onBlur={(e) => {
              const currentVal = formatDateForInput(time.real_end);
              if (e.target.value && e.target.value !== currentVal) {
                onDateChange(comp.component_id, e.target.value);
              }
            }}
          />
        </td>
        <td>
          <SelectMenu
            variant="full"
            options={statusOptions}
            maxSelections={1}
            selectedOption={[currentStatusId]}
            setSelectedOption={(updaterFunction) => {
              const newSelectionArray = updaterFunction([currentStatusId]);
              const newStatus = newSelectionArray[0];
              if (onStatusChange && newStatus) {
                onStatusChange(comp.component_id, newStatus);
              }
            }}
          />
        </td>
        {[1, 2, 3, 4, 5, 6, 7].map((id) => (
          <td key={id}>{comp.materials[id]?.total_material_consumed ?? 0}</td>
        ))}
        <td>
          {sumEquipmentValue(
            comp.materials.map((mat) => ({
              id: mat.material_id,
              value: mat.total_value,
            }))
          )}
        </td>
        <td>{(time?.total_hours / time?.qtd_employees || 0).toFixed(1)}</td>
      </tr>
    );
  });
}

// --- Componente Principal ---
function ProjectEquipmentsTable({ times, searchTerm, onRefresh }) {
  const [projectsSummary, setProjectsSummary] = useState([]);
  const [rowsExpands, setRowsExpand] = useState([]);
  const [groupedProjects, setGroupedProjects] = useState([]);
  const [summaryStatus, setSummaryStatus] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const { currentProject: project } = useContext(selectedProjectContext);

  const currentProject = useMemo(() => {
    if (!project?.id) return null;
    return projectsSummary.find((proj) => proj.project_id == project.id);
  }, [projectsSummary, project?.id]);

  const handleStatusChange = async (componentId, newStatus) => {
    try {
      setSummaryStatus((prev) => {
        if (!prev || !prev.components) return prev;
        return {
          ...prev,
          components: prev.components.map((comp) => {
            if (comp.component_id === componentId) {
              return { ...comp, status: newStatus };
            }
            return comp;
          }),
        };
      });
      await updateStatus(componentId, newStatus);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateChange = async (componentId, newValue) => {
    try {
      if (!newValue) return;
      setUpdatingId(componentId);
      const formattedForDb = newValue.replace("T", " ") + ":00";
      await updateCompletionDate(componentId, formattedForDb);

      if (onRefresh) {
        await onRefresh(); 
      }
    } catch (error) {
      console.error("Erro ao salvar data:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const user = await VerifyAuth();
      const [summary_data, status_data] = await Promise.all([
        vwProjectMaterialsSummary(user.user_id),
        vwSummaryStatus(),
      ]);
      setProjectsSummary(summary_data);
      setSummaryStatus(status_data);
    };
    loadData();
  }, []);

  useEffect(() => {
    let rawProjects = [];

    // 1. Determina quais projetos considerar
    if (currentProject) {
      rawProjects = [currentProject];
    } else {
      rawProjects = projectsSummary;
    }

    // 2. Filtra equipamentos
    const processed = rawProjects.map(proj => {
        const equips = proj.equipments || [];
        
        let filteredEquips = equips;
        if (searchTerm && searchTerm.trim() !== "") {
            filteredEquips = equips.filter(e => 
                e.equipment_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return {
            project_id: proj.project_id,
            project_name: proj.project_name,
            equipments: filteredEquips
        };
    }).filter(p => p.equipments.length > 0); 

    setGroupedProjects(processed);

  }, [currentProject, projectsSummary, searchTerm]);

  if (groupedProjects.length === 0) {
      return <div className="p-4 text-center text-gray-500">Nenhum equipamento encontrado.</div>;
  }

  return (
    <div className="flex flex-col gap-8 w-full pb-4">
      {groupedProjects.map((group) => (
        <div key={group.project_id} className="flex flex-col gap-2">
            
            {!project?.id && (
              <h2 className="text-lg font-bold text-gray-700 border-l-4 border-blue-500 pl-2">
                  {group.project_name}
              </h2>
            )}

            {/* Tabela do Projeto */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full project-equipments text-center">
                <thead>
                    <tr className="text-left bg-[#DBEBFF]">
                    <th className="first:rounded-tl-lg">Equipamentos</th>
                    <th>Início Prev.</th>
                    <th>Início Real</th>
                    <th>Fim Prev.</th>
                    <th>Fim Real</th>
                    <th>Status</th>
                    <th>Resina</th>
                    <th>Roving</th>
                    <th>Tecido KG</th>
                    <th>Tec. CMD</th>
                    <th>Catalizador</th>
                    <th>Manta</th>
                    <th>Reina ISO</th>
                    <th>Valor</th>
                    <th className="last:rounded-tr-lg">Horas-Homem</th>
                    </tr>
                </thead>
                <tbody>
                    {group.equipments.map((equip, idx) => {
                    const equip_totals = TotalEquipmentMaterial(equip);
                    const total_value = sumEquipmentValue(equip_totals);
                    const equipTime = times?.equipments?.[equip.equipment_id] || {};
                    const expanded = isExpanded(rowsExpands, equip.equipment_id);
                    const found = summaryStatus?.equipments?.find(
                        (e) => e.equipment_id == equip.equipment_id
                    );
                    
                    return (
                        <React.Fragment key={`${equip.equipment_id}-${idx}`}>
                        <tr
                            className="bg-gray-200 hover:cursor-pointer border-b border-gray-300 last:border-0"
                            onClick={() =>
                            setRowsExpand((prev) =>
                                expanded
                                ? prev.filter((id) => id !== equip.equipment_id)
                                : [...prev, equip.equipment_id]
                            )
                            }
                        >
                            <th className="font-semibold text-gray-800">{equip.equipment_name}</th>
                            <th>{formatDateTime(equipTime.planned_start)}</th>
                            <th>{formatDateTime(equipTime.real_start)}</th>
                            <th>{formatDateTime(equipTime.planned_end)}</th>
                            <th>{formatDateTime(equipTime.real_end)}</th>
                            <th>{statusLabel(found?.status)}</th>
                            {renderMaterialColumns(equip_totals)}
                            <th>{total_value}</th>
                            <th>{(equipTime.total_hours / equipTime.qtd_employees || 0).toFixed(1)}</th>
                        </tr>
                        {expanded &&
                            renderComponentRow(
                            equip.components,
                            times?.components || {},
                            summaryStatus.components,
                            handleStatusChange,
                            handleDateChange,
                            updatingId
                            )}
                        </React.Fragment>
                    );
                    })}
                </tbody>
                </table>
            </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectEquipmentsTable;