import api from "./api.js";

export const listMaterials = async () => {
  try {
    const response = await api.get("/materials");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error ao listar Materiais:", error);
    return [];
  }
};

export const createMaterial = async (
  material_name,
  material_desc,
  value,
  uni
) => {
  try {
    const response = await api.post("/materials", {
      material_name,
      material_desc,
      value,
      uni,
    });

    return response.data;
  } catch (error) {
    console.error("Error criar Material:", error);
    return [];
  }
};

export const updateMaterial = async (
  material_name,
  material_desc,
  value,
  uni,
  material_id
) => {
  try {
    const response = await api.put(`/materials/${material_id}`, {
      material_name,
      material_desc,
      value,
      uni,
    });

    return response.data;
  } catch (error) {
    console.error("Error criar Material:", error);
    return [];
  }
};

export const deleteMaterial = async (material_id) => {
  try {
    const response = await api.delete(`/materials/${material_id}`);
    return response.data;
  } catch (error) {
    console.error("Error criar Material:", error);
    return [];
  }
};
