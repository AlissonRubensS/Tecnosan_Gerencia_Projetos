import React, { useEffect, useState } from "react";

import {
  vwEquipmentRecipesMaterialSummary,
  vwComponentRecipeMaterialsSummary,
} from "@services/ViewsService.js";

// Importação do serviço
import { updateDates } from "@services/EquipRecipeCompRecipe";

const formatDate = (timestamp) => {
  if (!timestamp) return "-";
  const date = new Date(timestamp);

  if (isNaN(date.getTime())) return "Data Inválida";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const formatForInput = (timestamp) => {
  if (!timestamp) return "";
  try {
    return new Date(timestamp).toISOString().split("T")[0];
  } catch (error) {
    console.log(error);
    return "";
  }
};

function BudgetEquipmentTable({
  currentBudget,
  searchTerm = "",
  timelineTasks,
  timelineEquipments,
}) {
  const [equipmentsRecipesSummary, setEquipmentsRecipesSummary] = useState([]);
  const [componentsRecipesSummary, setComponentsRecipesSummary] = useState([]);
  const [rowsExpands, setRowsExpand] = useState([]);

  // Estado para armazenar alterações locais (Input Controlado)
  const [modifiedData, setModifiedData] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const [equipmentsSummaryData, componentsSummaryData] = await Promise.all([
        vwEquipmentRecipesMaterialSummary(currentBudget.id),
        vwComponentRecipeMaterialsSummary(currentBudget.id),
      ]);

      setEquipmentsRecipesSummary(equipmentsSummaryData);
      setComponentsRecipesSummary(componentsSummaryData);
    };
    loadData();
  }, [currentBudget]);

  // Atualiza o estado visual enquanto o usuário digita
  const handleInputChange = (componentId, field, value) => {
    setModifiedData((prev) => ({
      ...prev,
      [componentId]: {
        ...prev[componentId],
        [field]: value,
      },
    }));
  };

  // --- FUNÇÃO DE SALVAMENTO (ATUALIZAÇÃO PARCIAL) ---
  const handleDateSave = async (
    equipment_recipe_id,
    component_recipe_id,
    type
  ) => {
    // 1. Pega o valor que está no estado (o que o usuário acabou de digitar/sair)
    const newValue = modifiedData[component_recipe_id]?.[type];

    // Se não houver valor alterado no estado para esse campo, não faz nada
    if (!newValue) return;

    try {
      console.log(
        `Salvando Parcial... Equip: ${equipment_recipe_id}, Comp: ${component_recipe_id}, Alterando: ${type} para ${newValue}`
      );

      // 2. Define os payloads.
      // Como o backend aceita atualização parcial, enviamos apenas o que mudou.
      // O outro campo vai como null (ou undefined) para que o backend o ignore.
      const startToSend = type === "start" ? newValue : null;
      const endToSend = type === "end" ? newValue : null;

      // 3. Chama o serviço
      await updateDates(
        equipment_recipe_id,
        component_recipe_id,
        startToSend,
        endToSend
      );

      console.log("Data atualizada com sucesso!");
      
    } catch (error) {
      console.error("Erro ao salvar data:", error);
      alert("Erro ao salvar a data no cronograma.");
    }
  };

  const getInputValue = (componentId, field, originalDate) => {
    if (
      modifiedData[componentId] &&
      modifiedData[componentId][field] !== undefined
    ) {
      return modifiedData[componentId][field];
    }
    return formatForInput(originalDate);
  };

  return (
    <table className="w-full project-equipments text-center">
      <thead>
        <tr className="text-left bg-[#DBEBFF]">
          <th className="first:rounded-tl-lg" colSpan={2}>
            Equipamentos
          </th>
          <th>Início</th>
          <th>Fim</th>
          <th>Resina</th>
          <th>Roving</th>
          <th>Tecido KG</th>
          <th>Tec. CMD</th>
          <th>Catalizador</th>
          <th>Manta</th>
          <th>Reina ISO</th>
          <th>Valor</th>
          <th className="last:rounded-tr-lg">Horas</th>
        </tr>
      </thead>
      <tbody>
        {equipmentsRecipesSummary
          ?.filter((equip) =>
            equip?.recipe_name
              ?.toLowerCase()
              ?.includes(searchTerm?.toLowerCase())
          )
          .map((equip) => {
            const timeline_proj = timelineEquipments.find(
              (time_equip) =>
                time_equip.equipment_recipe_id == equip.equipment_recipe_id
            );
            return (
              <React.Fragment key={equip?.equipment_recipe_id}>
                <tr className="bg-gray-200">
                  <td>
                    <button
                      onClick={() => {
                        if (
                          !rowsExpands?.includes(equip?.equipment_recipe_id)
                        ) {
                          setRowsExpand((prev) => [
                            ...prev,
                            equip?.equipment_recipe_id,
                          ]);
                        } else {
                          setRowsExpand((prev) =>
                            prev.filter(
                              (row) => row != equip?.equipment_recipe_id
                            )
                          );
                        }
                      }}
                    >
                      <img
                        src={
                          rowsExpands?.includes(equip?.equipment_recipe_id)
                            ? "src/imgs/remove-square.png"
                            : "src/imgs/add-square.png"
                        }
                        className="w-5 h-5"
                        alt="Toggle"
                      />
                    </button>
                  </td>
                  <td>{equip.recipe_name}</td>
                  <td>{formatDate(timeline_proj?.equipment_start_at)}</td>
                  <td>{formatDate(timeline_proj?.equipment_end_at)}</td>
                  <td>{equip.resina}</td>
                  <td>{equip.roving}</td>
                  <td>{equip.tecido_kg}</td>
                  <td>{equip.tecido_cmd}</td>
                  <td>{equip.catalizador}</td>
                  <td>{equip.manta}</td>
                  <td>{equip.resina_iso}</td>
                  <td>{equip.total_value}</td>
                  <td>{equip.horas_homem}</td>
                </tr>
                {rowsExpands?.includes(equip?.equipment_recipe_id) &&
                  componentsRecipesSummary
                    .filter(
                      (c) => c.equipment_recipe_id == equip.equipment_recipe_id
                    )
                    .map((comp, index) => {
                      const comp_tasks = timelineTasks.find(
                        (taks) =>
                          taks.component_recipe_id == comp.component_recipe_id
                      );

                      const bg_color =
                        index % 2 == 0 ? "bg-gray-50" : "bg-gray-100";

                      return (
                        <tr key={comp.component_recipe_id} className={bg_color}>
                          <td colSpan={2}>{comp.recipe_name}</td>

                          {/* INPUT DE INÍCIO */}
                          <td>
                            <input
                              type="date"
                              className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none w-full cursor-pointer hover:bg-white text-center"
                              value={getInputValue(
                                comp.component_recipe_id,
                                "start",
                                comp_tasks?.planned_start_at
                              )}
                              onChange={(e) =>
                                handleInputChange(
                                  comp.component_recipe_id,
                                  "start",
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                handleDateSave(
                                  equip.equipment_recipe_id,
                                  comp.component_recipe_id,
                                  "start"
                                )
                              }
                            />
                          </td>

                          {/* INPUT DE FIM */}
                          <td>
                            <input
                              type="date"
                              className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none w-full cursor-pointer hover:bg-white text-center"
                              value={getInputValue(
                                comp.component_recipe_id,
                                "end",
                                comp_tasks?.planned_end_at
                              )}
                              onChange={(e) =>
                                handleInputChange(
                                  comp.component_recipe_id,
                                  "end",
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                handleDateSave(
                                  equip.equipment_recipe_id,
                                  comp.component_recipe_id,
                                  "end"
                                )
                              }
                            />
                          </td>

                          <td>{comp.resina}</td>
                          <td>{comp.roving}</td>
                          <td>{comp.tecido_kg}</td>
                          <td>{comp.tecido_cmd}</td>
                          <td>{comp.catalizador}</td>
                          <td>{comp.manta}</td>
                          <td>{comp.resina_iso}</td>
                          <td>{comp.total_value}</td>
                          <td>{comp.horas_homem}</td>
                        </tr>
                      );
                    })}
              </React.Fragment>
            );
          })}
      </tbody>
    </table>
  );
}

export default BudgetEquipmentTable;