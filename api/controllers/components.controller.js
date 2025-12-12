import { pool } from "../config/db.js";

export const getComponentStatus = async (req, res) => {
  try{
    const response = await pool.query(`SELECT component_id, status FROM components;`)

    if (response.rowCount == 0){
      return res.status(404).json({menssage : "Nenhum componente encontrado"})
    }

    res.status(200).json(response.rows)
  }catch(error){
    res.status(500).json({error: "Erro ao listar status dos componentes"})
  }
}