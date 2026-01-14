import api from "./api.js";

export const getEquipment = async (project_id) => {
  try {
    if (!project_id) return null;
    const response = await api.get(`/equipments/${project_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching equipment:", error);
    throw error;
  }
};

export const listEquipments = async () => {
  try {
    const response = await api.get("/equipments");
    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching equipments", error);
  }
};

// export const createEquipment = async () => {
//   try {
//     const response = await api.post("/equipments");
//   } catch (error) {
//     console.error(error);
//   }
// };
