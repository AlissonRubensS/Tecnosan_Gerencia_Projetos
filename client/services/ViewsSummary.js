import api from "./api.js";

export const vwProjectMaterialsSummary = async (user_id) => {
  try {
    const response = await api.get(`/vwSummary/projects/${user_id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erro para contar quantidade de material consumido por projeto",
      error
    );
    return [];
  }
};

export const totalMaterialsProjects = async (user_id) => {
  try {
    const response = await api.get(
      `/vwSummary/projects-materials/${user_id}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erro para contar quantidade de material consumido por projeto",
      error
    );
    return [];
  }
};

export const totalValuesProjects = async (user_id) => {
  try {
    const response = await api.get(`/vwSummary/projects-values/${user_id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erro para contar quantidade de material consumido por projeto",
      error
    );
    return [];
  }
};

export const vwEquipmentMaterialsSummary = async (user_id) => {
  try {
    if (!user_id) {
      console.error("Usuário inválido");
      return;
    }
    const response = await api.get(`/vwSummary/equipments/${user_id}`);
    return response.data ? response.data : [];
  } catch (error) {
    console.error(
      "Erro ao contar quantidades de dias atrasados por setor",
      error
    );
    return [];
  }
};

export const vwComponentRecipeMaterials = async (user_id) => {
  try {
    if (!user_id) {
      console.error("usuario inválido");
      return;
    }
    const response = await api.get("/vwSummary/components/" + user_id);
    return response.data && Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(
      "Erro no Service ao contar quantidade de materiais na receita do equipamento",
      error
    );
    return [];
  }
};

export const vwTotalProjectsMaterials = async (user_id) => {
  try {
    const response = await api.get(`/vwSummary/total/projects/${user_id}`);
    return response.data && Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erro no Service", error);
    return [];
  }
};

export const vwSummaryStatus = async () => {
  try {
    const responseComponentStatus = await api.get(
      "http://localhost:3001/components/status"
    );
    const responseEquipmentStatus = await api.get(
      `/vwSummary/status/equipments/`
    );
    const responseProjectsStatus = await api.get(
      `/vwSummary/status/projects/`
    );

    if (
      !responseComponentStatus ||
      !responseEquipmentStatus ||
      !responseProjectsStatus
    ) {
      console.error("Dados não foram devidamente requisitado");
      return undefined;
    }

    return {
      components: responseComponentStatus.data,
      equipments: responseEquipmentStatus.data,
      projects: responseProjectsStatus.data,
    };
  } catch (error) {
    console.error("Erro no service", error);
    return [];
  }
};

export const getProjectsTimeline = async () => {
  try {
    const response = await api.get(`/vwSummary/projects-timeline`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cronograma de projetos", error);
    return [];
  }
};

export const getEquipmentsTimeline = async () => {
  try {
    const response = await api.get(`/vwSummary/equipments-timeline`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cronograma de equipamentos", error);
    return [];
  }
};

export const getEquipmentsTimelineByBudget = async (budget_id) => {
  try {
    if (!budget_id) {
      console.error("budget id undfinned");
      return;
    }

    const response = await api.get(
      `/vwSummary/equipments-timeline/${budget_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cronograma de equipamentos", error);
    return [];
  }
};

export const getTasksTimeline = async () => {
  try {
    const response = await api.get(`/vwSummary/tasks-timeline`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cronograma de tarefas detalhado", error);
    return [];
  }
};

export const vwComponentMaterialsSummary = async () => {
  try {
    const response = await api.get(`/vwSummary/component/material/summary`);
    if (response.data) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};
