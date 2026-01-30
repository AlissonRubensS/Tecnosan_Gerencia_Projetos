import api from "./api.js";

// ===================================================================================
// 1. LISTAGEM (Retorna TUDO do banco, sem formatação)
// ===================================================================================

export const listAccessories = async () => {
  try {
    const response = await api.get("/accessories");
    if (!Array.isArray(response.data)) return [];
    return response.data;
  } catch (error) {
    console.error("Erro ao listar acessórios:", error);
    return [];
  }
};

// ===================================================================================
// 2. OPERAÇÕES DE ESCRITA E MOVIMENTAÇÃO
// ===================================================================================

export const createAccessory = async (name, serialNumber, value, purchaseDate) => {
  try {
    const payload = {
      name: name,
      serial_number: serialNumber,
      value: value,
      purchase_date: purchaseDate
    };
    const response = await api.post("/accessories", payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar acessório:", error);
    throw error;
  }
};

export const updateAccessory = async (id, name, serialNumber, value, purchaseDate) => {
  try {
    const payload = {
      name: name,
      serial_number: serialNumber,
      value: value,
      purchase_date: purchaseDate
    };
    const response = await api.put(`/accessories/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar acessório:", error);
    throw error;
  }
};

export const deleteAccessory = async (id) => {
  try {
    const response = await api.delete(`/accessories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar acessório:", error);
    throw error;
  }
};

export const loanToProject = async (project_id, accessory_id, user_id, taken_at) => {
  const response = await api.post("/accessories/loan/project", { 
    project_id, 
    accessory_id, 
    user_id, 
    taken_at 
  });
  return response.data;
};

export const loanToBudget = async (budget_id, accessory_id, user_id, taken_at) => {
  const response = await api.post("/accessories/loan/budget", { 
    budget_id, 
    accessory_id, 
    user_id, 
    taken_at 
  });
  return response.data;
};

// === AQUI ESTAVA O ERRO ===
// Atualizado para receber 4 parâmetros: (id, user, DATA, type)
export const returnAccessory = async (movement_id, received_by_user_id, returned_at, type) => {
  const response = await api.put("/accessories/return", { 
    movement_id, 
    received_by_user_id, 
    returned_at, // <--- Agora enviamos a data corretamente
    type 
  });
  return response.data;
};

export const listActiveLoans = async () => {
  const response = await api.get("/accessories/loans/active");
  return Array.isArray(response.data) ? response.data : [];
};