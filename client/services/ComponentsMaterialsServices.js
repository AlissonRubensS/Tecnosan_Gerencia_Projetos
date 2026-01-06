import axios from "axios";
const API_URL = "http://localhost:3001/components/materials";

export const addMaterialConsumption = async (
  component_id,
  material_id,
  consumed_quantity,
  user_id
) => {
  try {
    const response = await axios.post(API_URL, {
      component_id,
      material_id,
      consumed_quantity,
      user_id,
    });
    //component_id, material_id, consumed_quantity, user_id
    return response.data;
  } catch (error) {
    console.error("Erro ao registrar consumo:", error);
    throw error;
  }
};
