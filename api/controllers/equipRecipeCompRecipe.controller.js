import { pool } from "../config/db.js";

export const createEquipRecipeCompRecipe = async (req, res) => {
  try {
    const { equipment_recipe_id, component_recipe_id, quantity_plan } =
      req.body;
    if (!equipment_recipe_id || !component_recipe_id || !quantity_plan) {
      return res.status(400).json({ message: "Algum dado está faltando" });
    }
    const response = await pool.query(
      `INSERT INTO equipment_recipes_component_recipes
            (equipment_recipe_id, component_recipe_id, quantity_plan)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [equipment_recipe_id, component_recipe_id, quantity_plan]
    );
    res.status(200).json(response.row);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error ao criar receita do equipamento" + error });
  }
};

export const readEquipRecipeCompRecipe = async (req, res) => {
  try {
    const response = await pool.query(
      "SELECT * FROM equipment_recipes_component_recipes"
    );
    res.status(200).json(response.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao listar receitas dos equipamento" + error });
  }
};

export const readEquipRecipeCompRecipeById = async (req, res) => {
  try {
    const { equipment_recipe_id } = req.params;

    if (!equipment_recipe_id) {
      res.status(400).json({ error: "Dados faltantes" });
      return;
    }

    const response = await pool.query(
      "SELECT * FROM equipment_recipes_component_recipes WHERE equipment_recipe_id = $1;",
      [equipment_recipe_id]
    );

    res.status(200).json(response.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao listar receitas dos equipamento" + error });
  }
};

export const updateEquipRecipeCompRecipe = async (req, res) => {
  try {
    const { quantity_plan } = req.body;
    const { equipment_recipe_id, component_recipe_id } = req.params;
    const response = await pool.query(
      `UPDATE equipment_recipes_component_recipes
        SET 
	        quantity_plan = $3
        WHERE equipment_recipe_id = $1 AND component_recipe_id = $2
        RETURNING *`,
      [equipment_recipe_id, component_recipe_id, quantity_plan]
    );
    response.rowCount > 0
      ? res.status(200).json(response.rows)
      : res
          .status(404)
          .json({ error: "Não foi possivel encontrar a relação na tebela" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error ao atualizar receita do equipamento" + error });
  }
};

export const deleteEquipRecipeCompRecipe = async (req, res) => {
  try {
    const { equipment_recipe_id, component_recipe_id } = req.params;
    const response = await pool.query(
      `
        DELETE FROM equipment_recipes_component_recipes 
        WHERE equipment_recipe_id = $1
        AND component_recipe_id = $2
        RETURNING *`,
      [equipment_recipe_id, component_recipe_id]
    );
    response.rowCount > 0
      ? res.status(200).json(response.rows)
      : res
          .status(404)
          .json({ error: "Não foi possivel encontrar a relação na tebela" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error ao atualizar receita do equipamento" + error });
  }
};
