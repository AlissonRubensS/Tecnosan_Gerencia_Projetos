/* eslint-disable no-unused-vars */
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";

import SelectMenu from "../../Ui/SelectMenu";

import { listMaterials } from "@services/MaterialService.js";
import { updateComponentRecipe } from "@services/ComponentRecipes.js";
import {
  createCompRecipeMat,
  readCompRecipeMatByComp,
  updateCompRecipeMat,
  deleteCompRecipeMat,
} from "@services/ComponentRecipeMaterials.js";

export default function EditComponentRecipeModal({
  isVisible,
  setVisible,
  component,
}) {
  const [componenteRecipeName, setComponentRecipeName] = useState("");
  const [manHours, setManHours] = useState("");
  const [materials, setMaterials] = useState([]);

  const [materialsList, setMaterialsList] = useState([]);
  const [materialsQuantity, setMaterialsQuantity] = useState([]);

  const [materialsQuantityBackUp, setMaterialsQuantityBackUp] = useState([]);

  // ----------------------------------------------------------
  // CARREGAMENTO INICIAL
  // ----------------------------------------------------------
  useEffect(() => {
    if (!component || !isVisible) return;

    const fetchMaterials = async () => {
      const data = await listMaterials();
      setMaterials(Array.isArray(data) ? data : []);
    };

    const loadInit = async () => {
      setComponentRecipeName(component.Componente ?? "");
      setManHours(component["Horas Homem"] ?? "");

      const data = await readCompRecipeMatByComp(component.ID);
      if (!Array.isArray(data)) return;

      const ids = data.map((m) => m.material_id);
      const qty = data.map((m) => ({
        id: m.material_id,
        quantity: Number(m.quantity_plan),
      }));

      setMaterialsList(ids);
      setMaterialsQuantity(qty);
      setMaterialsQuantityBackUp(qty);
    };

    fetchMaterials();
    loadInit();
  }, [component, isVisible]);

  // ----------------------------------------------------------
  // SINCRONIZAÇÃO ENTRE SELECT E QUANTIDADES
  // ----------------------------------------------------------
  useEffect(() => {
    setMaterialsQuantity((prev) => {
      const exist = new Set(prev.map((p) => p.id));

      const novos = materialsList
        .filter((id) => !exist.has(id))
        .map((id) => ({ id, quantity: 1 }));

      return [...prev, ...novos];
    });
  }, [materialsList]);

  // ----------------------------------------------------------
  // LIMPAR
  // ----------------------------------------------------------
  const clearStates = () => {
    setComponentRecipeName("");
    setManHours("");
    setMaterialsList([]);
    setMaterialsQuantity([]);
    setMaterialsQuantityBackUp([]);
    setVisible(false);
  };

  // ----------------------------------------------------------
  // SALVAR
  // ----------------------------------------------------------
  const handleSave = async () => {
    try {
      if (!componenteRecipeName || !manHours || materialsList.length <= 0) {
        console.error("Informações inválidas!");
        return;
      }

      // Atualiza nome do componente
      await updateComponentRecipe(component.ID, componenteRecipeName, manHours);

      // CREATE / UPDATE
      for (const item of materialsQuantity) {
        const old = materialsQuantityBackUp.find((x) => x.id === item.id);

        if (!old) {
          // CRIAR
          await createCompRecipeMat(component.ID, item.id, item.quantity);
        } else if (old.quantity !== item.quantity) {
          // ATUALIZAR
          await updateCompRecipeMat(component.ID, item.id, item.quantity);
        }
      }

      // DELETE
      for (const oldItem of materialsQuantityBackUp) {
        const exists = materialsQuantity.some((x) => x.id === oldItem.id);

        if (!exists) {
          await deleteCompRecipeMat(component.ID, oldItem.id);
        }
      }

      clearStates();
      window.location.reload();
    } catch (err) {
      console.error("Erro ao salvar lista de materiais", err);
    }
  };

  if (!isVisible) return null;

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-screen min-h-screen overflow-auto">
      <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-[70vw] max-w-[120vw] h-[70vh] max-h-[90vh] flex flex-col space-y-8 overflow-auto">
        <form
          className="flex flex-col space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {/* Título */}
          <div className="flex flex-row items-center justify-between">
            <p className="text-lg font-semibold">
              Editar Receita do Componente
            </p>
            <button onClick={() => clearStates()} type="button">
              <IoMdClose className="text-gray-600 hover:text-gray-700 hover:bg-gray-300 rounded" />
            </button>
          </div>

          {/* NOME + HORAS */}
          <div className="flex flex-row w-full justify-between gap-6">
            <div className="flex flex-col space-y-2 w-full">
              <label>Nome *</label>
              <input
                type="text"
                className="p-2 rounded"
                value={componenteRecipeName}
                onChange={(e) => setComponentRecipeName(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <label>Horas Homem *</label>
              <input
                type="number"
                className="p-2 rounded"
                value={manHours}
                onChange={(e) => setManHours(e.target.value)}
              />
            </div>
          </div>

          {/* SELECT DE MATERIAIS */}
          <div>
            <label>Materiais *</label>
            <SelectMenu
              options={materials.map((m) => ({
                id: m.material_id,
                label: m.material_name,
              }))}
              selectedOption={materialsList}
              setSelectedOption={setMaterialsList}
            />
          </div>

          {/* TABELA DE MATERIAIS */}
          <div className="flex flex-col bg-white p-2 rounded w-full">
            <table className="w-full">
              <thead>
                <tr className="grid grid-cols-6 gap-6">
                  <th>Material</th>
                  <th>Descrição</th>
                  <th>Valor Unitário</th>
                  <th>Qtd</th>
                  <th>Valor Total</th>
                  <th>Ação</th>
                </tr>
              </thead>

              <tbody>
                {materialsList.map((id) => {
                  const mat = materials.find((m) => m.material_id === id);
                  const objQty = materialsQuantity.find((m) => m.id === id);

                  return (
                    <tr key={id} className="grid grid-cols-6 gap-6">
                      <td>{mat?.material_name ?? "-"}</td>
                      <td>{mat?.material_desc ?? "-"}</td>
                      <td>
                        {Number(mat?.value || 0).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>

                      <td>
                        <input
                          type="number"
                          className="border p-1 w-20"
                          value={objQty?.quantity || 1}
                          onChange={(e) => {
                            const newValue = Number(e.target.value);
                            setMaterialsQuantity((prev) =>
                              prev.map((m) =>
                                m.id === id ? { ...m, quantity: newValue } : m
                              )
                            );
                          }}
                        />
                      </td>

                      <td>
                        {(objQty?.quantity * (mat?.value || 0)).toLocaleString(
                          "pt-BR",
                          { style: "currency", currency: "BRL" }
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="bnt"
                          onClick={() => {
                            setMaterialsList((list) =>
                              list.filter((x) => x !== id)
                            );

                            setMaterialsQuantity((prev) =>
                              prev.filter((x) => x.id !== id)
                            );
                          }}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* BOTÕES */}
          <div className="flex flex-row justify-end space-x-4">
            <button
              className="p-2 bg-slate-50 hover:bg-gray-300 rounded"
              type="button"
              onClick={() => clearStates()}
            >
              Cancelar
            </button>

            <button className="bnt-add" type="submit">
              Salvar Receita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
