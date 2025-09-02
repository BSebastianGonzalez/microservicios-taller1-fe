import axios from "../api/axios";

const AdminService = {
  // Iniciar sesión
  login: async (correo, contrasenia) => {
    try {
      const response = await axios.post("/admins/login", { correo, contrasenia });

      localStorage.setItem("admin", JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  },


  // Obtener todos los administradores
  getAllAdmins: async () => {
    try {
      const response = await axios.get("/admins/list");
      return response.data;
    } catch (error) {
      console.error("Error al obtener la lista de administradores:", error);
      throw error;
    }
  },

  // Obtener un administrador por ID
  getAdminById: async (id) => {
    try {
      const response = await axios.get(`/admins/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el administrador con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo administrador
  createAdmin: async (admin) => {
    try {
      const response = await axios.post("/admins", admin);
      return response.data;
    } catch (error) {
      console.error("Error al crear un nuevo administrador:", error);
      throw error;
    }
  },

  // Actualizar un administrador existente
  updateAdmin: async (id, adminDetails) => {
    try {
      const response = await axios.put(`/admins/${id}`, adminDetails);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el administrador con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un administrador
  deleteAdmin: async (id) => {
    try {
      await axios.delete(`/admins/${id}`);
    } catch (error) {
      console.error(`Error al eliminar el administrador con ID ${id}:`, error);
      throw error;
    }
  },
};

export default AdminService;