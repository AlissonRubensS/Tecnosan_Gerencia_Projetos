import { pool } from "../config/db.js";

export const getComponentStatus = async (req, res) => {
  try {
    const response = await pool.query(
      `SELECT component_id, status FROM components;`
    );

    if (response.rowCount == 0) {
      return res.status(404).json({ menssage: "Nenhum componente encontrado" });
    }

    res.status(200).json(response.rows);
  } catch (error) {
    res.status(500).json({ error: error.menssage });
  }
};

export const getComponents = async (req, res) => {
  try {
    const response = await pool.query("SELECT * FROM components;");

    if (response.rowCount == 0) {
      return res.status(404).json({ menssage: "Nenhum componente encontrado" });
    }

    res.status(200).json(response.rows);
  } catch (error) {
    res.status(500).json({ error: error.menssage });
  }
};

export const createComponents = async (req, res) => {
  try {
    const {
      component_name,
      completion_date,
      start_date,
      deadline,
      status,
      equipment_id,
      department_id,
      component_recipe_id,
    } = req.body;

    if (
      !component_name ||
      !start_date ||
      !deadline ||
      !status ||
      !equipment_id ||
      !department_id ||
      !component_recipe_id
    ) {
      console.error("dados insuficientes", {
        component_name,
        completion_date,
        start_date,
        deadline,
        status,
        equipment_id,
        department_id,
        component_recipe_id,
      });
      return res.status(500).json({ error: "dados insuficientes" });
    }

    const response = await pool.query(
      `INSERT INTO components
        (component_name, completion_date, start_date, deadline, status, equipment_id, department_id, component_recipe_id) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING component_id;`,
      [
        component_name,
        completion_date,
        start_date,
        deadline,
        status,
        equipment_id,
        department_id,
        component_recipe_id,
      ]
    );

    res.status(200).json(response.rows);
  } catch (error) {
    res.status(500).json({ error: error.menssage });
  }
};

export const updateComponents = async (req, res) => {
  try {
    const { component_id } = req.params;
    // Adicionei total_time_spent aqui
    const {
      completion_date,
      start_date,
      deadline,
      status,
      department_id,
      total_time_spent,
    } = req.body;

    const response = await pool.query(
      `UPDATE components
       SET 
         completion_date = $1,
         start_date = $2,
         deadline = $3,
         status = $4,
         department_id = $5,
         total_time_spent = $6 
       WHERE component_id = $7 RETURNING *;`,
      [
        completion_date,
        start_date,
        deadline,
        status,
        department_id,
        total_time_spent || 0,
        component_id,
      ]
    );

    res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error); // Bom para debugar no terminal do servidor
    res.status(500).json({ error: error.message });
  }
};

export const deleteComponent = async (req, res) => {
  try {
    const { component_id } = req.params;

    if (!component_id) {
      return res.status(500).json({ error: "dados insuficientes" });
    }

    const response = await pool.query(
      `DELETE FROM components
      WHERE component_id = $1;`,
      [equipment_id]
    );

    if (response.rowCount == 0) {
      return res.status(404).json({ error: "Componente não foi encontrado" });
    }
    res.status(200).json(response.rows);
  } catch (error) {
    res.status(500).json({ error: error.menssage });
  }
};
