import api from "./api.js"

export async function createBudget(
  user_id,
  budget_name,
  budget_local,
  budget_desc
) {
  try {
    const response = await api.post("/budgets", {
      user_id,
      budget_name,
      budget_local,
      budget_desc,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar orçamento:", error);
    throw error;
  }
}

export async function listBudgets(user_id) {
  try {
    const response = await api.get(`/budgets/${user_id}`);
    return Array.isArray(response.data) ? response.data : null;
  } catch (error) {
    console.error("Error ao listar orçamentos", error);
    throw error;
  }
}
