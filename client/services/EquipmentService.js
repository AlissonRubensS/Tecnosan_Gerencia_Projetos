import axios from "axios";
const API_URL = "http://localhost:3001/equipments";

export const getEquipment = async (project_id) => {
  try {
    const response = await axios.get(`${API_URL}/${project_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching equipment:", error);
    throw error;
  }
};
