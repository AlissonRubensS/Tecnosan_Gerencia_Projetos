import api from "./api.js";

export async function createRelation(budget_id, equipment_id, quantity_plan) {
  try {
    if (!budget_id || !equipment_id || quantity_plan <= 0) {
      throw new Error("Faltando dados");
    }
    const response = await api.post("/budgets-equip-recipes/", {
      budget_id,
      equipment_id,
      quantity_plan,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar orçamento:", error);
    throw error;
  }
}
