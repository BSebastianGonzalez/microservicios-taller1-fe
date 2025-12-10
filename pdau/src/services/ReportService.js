import axios from "../api/axios";

const getReportsBaseUrl = () => import.meta.env.VITE_REPORTS_API_URL || "";

const ReportService = {
  async getTotal() {
    const base = getReportsBaseUrl();
    const { data } = await axios.get(`${base}api/reportes/denuncias/total`);
    return data;
  },

  async getPorEstado() {
    const base = getReportsBaseUrl();
    const { data } = await axios.get(`${base}api/reportes/denuncias/por-estado`);
    return data;
  },

  async getPorCategoria() {
    const base = getReportsBaseUrl();
    const { data } = await axios.get(`${base}api/reportes/denuncias/por-categoria`);
    return data;
  },

  async getPorFechas(inicio, fin) {
    const base = getReportsBaseUrl();
    const { data } = await axios.get(`${base}api/reportes/denuncias/por-fechas`, {
      params: { inicio, fin },
    });
    return data;
  },
};

export default ReportService;
