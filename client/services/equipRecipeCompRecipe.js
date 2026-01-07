import api from "./api.js";

export const readEquipRecipeCompRecipe = async () => {
  try {
    const response = await api.get("/equip-recipe-comp-recipe");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error na requisição:", error);
    throw error;
  }
};

export const readEquipRecipeCompRecipeById = async (equipment_recipe_id) => {
  try {
    if (!equipment_recipe_id) {
      console.error("ID não existe");
      return;
    }

    const response = await api.get(
      `/equip-recipe-comp-recipe/${equipment_recipe_id}`
    );
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error na requisição:", error);
    throw error;
  }
};

export const createEquipRecipeCompRecipe = async (
  equipment_recipe_id,
  component_recipe_id,
  quantity_plan
) => {
  try {
    const response = await api.post("/equip-recipe-comp-recipe", {
      equipment_recipe_id,
      component_recipe_id,
      quantity_plan,
    });

    return response.data;
  } catch (error) {
    console.error("Error na requisição:", error);
    throw error;
  }
};

export const updateEquipRecipeCompRecipe = async (
  equipment_recipe_id,
  component_recipe_id,
  quantity_plan
) => {
  try {
    const response = await api.put(
      `/equip-recipe-comp-recipe/${equipment_recipe_id}/${component_recipe_id}`,
      {
        quantity_plan,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error na requisição:", error);
    throw error;
  }
};

export const deleteEquipRecipeCompRecipe = async (
  equipment_recipe_id,
  component_recipe_id
) => {
  try {
    const response = await api.delete(
      `/equip-recipe-comp-recipe/${equipment_recipe_id}/${component_recipe_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error na na requisição:", error);
    throw error;
  }
};
