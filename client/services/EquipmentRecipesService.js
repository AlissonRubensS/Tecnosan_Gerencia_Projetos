import api from "./api.js";

export const createEquipmentRecipe = async (recipe_name) => {
  try {
    if (!recipe_name) {
      console.error("Dados insuficientes!");
      return;
    }

    const response = await api.post("/equip-recipe", { recipe_name });
    return response.data;
  } catch (error) {
    console.error("Erro na requisição", error);
  }
};

export const readEquipmentRecipe = async () => {
  try {
    const response = await api.get("/equip-recipe");
    return response.data;
  } catch (error) {
    console.error("Erro na requisição", error);
  }
};

export const updateEquipmentRecipe = async (
  equipment_recipe_id,
  recipe_name
) => {
  try {
    if (!equipment_recipe_id || !recipe_name) {
      console.error("Dados faltante");
      return;
    }

    const response = await api.put(`/equip-recipe/${equipment_recipe_id}`, {
      recipe_name,
    });
    return response.data;
  } catch (error) {
    console.error("Erro na requisição", error);
  }
};

export const deleteEquipmentRecipe = async (equipment_recipe_id) => {
  try {
    if (!equipment_recipe_id) {
      console.error("Dados faltante");
      return;
    }

    const response = await api.delete(`/equip-recipe/${equipment_recipe_id}`);
    return response.data;
  } catch (error) {
    console.error("Erro na requisição", error);
  }
};
