import api from "./api.js";

// Function to list projects for a specific user
export const listProjects = async (user_id) => {
  if (!user_id) return [];
  try {
    const response = await api.get(`/projects/${user_id}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};
