import axios from "../api/axios";

const CategoryStatisticsService = {

  getBaseUrl() {
    return import.meta.env.VITE_API_URL;
  },

  // Obtener estadísticas de categorías
  async getCategoryStatistics() {
    try {
      const baseUrl = this.getBaseUrl();
      console.log('📊 Obteniendo estadísticas de:', `${baseUrl}/api/categorias/categorias`);

      const response = await axios.get(`${baseUrl}/api/categorias/categorias`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener estadísticas de categorías:", error);
      throw error;
    }
  },

  // Obtener todas las categorías
  async getAllCategories() {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await axios.get(`${baseUrl}/api/categorias/list`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      throw error;
    }
  }
};

export default CategoryStatisticsService;