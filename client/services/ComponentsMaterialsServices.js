import api from "./api.js";

export const addMaterialConsumption = async (
  component_id,
  material_id,
  consumed_quantity,
  user_id
) => {
  try {
    const response = await api.post("/components/materials", {
      component_id,
      material_id,
      consumed_quantity,
      user_id,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao registrar consumo:", error);
    throw error;
  }
};
