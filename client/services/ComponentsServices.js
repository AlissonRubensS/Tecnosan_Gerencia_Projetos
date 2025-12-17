import axios from "axios";
const API_URL = "http://localhost:3001/components";

export const countStatusComponents = async (
  project_id,
  start_date,
  end_date
) => {
  try {
    const response = await axios.get(API_URL + "/status_count", {
      params: {
        project_id: project_id,
        start_date: start_date,
        end_date: end_date,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao contar status dos componentes", error);
  }
};

export const getComponents = async () => {
  try {
    const response = await axios.get(API_URL);
    if (Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.error("Erro ao listar componentes", error);
  }
};
