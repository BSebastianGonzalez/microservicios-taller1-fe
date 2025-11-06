class ManagementIndicatorService {
  
  static getBaseUrl() {
    return import.meta.env.VITE_RESPUESTAS_API_URL || 'https://pdau-complaintmanagement-production.up.railway.app';
  }

  // Generar indicadores
  static async generateResponseTimeIndicators() {
    try {
      const baseUrl = this.getBaseUrl();
      console.log('🔄 Generando indicadores en:', `${baseUrl}/api/indicadores/generar`);
      
      const response = await fetch(`${baseUrl}/api/indicadores/generar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Indicador generado:', result);
      return this.mapearIndicadorBackendToFrontend(result);
      
    } catch (error) {
      console.error('❌ Error generando indicadores:', error);
      throw new Error(`No se pudieron generar los indicadores: ${error.message}`);
    }
  }

  // Obtener historial (LISTAR todos)
  static async getIndicatorsHistory() {
    try {
      const baseUrl = this.getBaseUrl();
      
      const response = await fetch(`${baseUrl}/api/indicadores`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 Historial obtenido:', data.length, 'registros');
      
      // Mapear y ordenar por fecha más reciente primero
      return data
        .map(indicador => this.mapearIndicadorBackendToFrontend(indicador))
        .sort((a, b) => new Date(b.fechaGeneracion) - new Date(a.fechaGeneracion));
      
    } catch (error) {
      console.error('❌ Error obteniendo historial:', error);
      throw new Error(`No se pudo cargar el historial: ${error.message}`);
    }
  }

  // Obtener por ID
  static async getIndicatorById(id) {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/indicadores/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      
      const data = await response.json();
      return this.mapearIndicadorBackendToFrontend(data);
      
    } catch (error) {
      console.error('Error obteniendo indicador por ID:', error);
      throw error;
    }
  }

  // Mapear datos del backend al frontend
  static mapearIndicadorBackendToFrontend(indicadorBackend) {
    const totalDenuncias = indicadorBackend.menor3Dias + 
                          indicadorBackend.entre3y5Dias + 
                          indicadorBackend.entre5y10Dias + 
                          indicadorBackend.mayor10Dias;

    return {
      id: indicadorBackend.id,
      fechaGeneracion: indicadorBackend.fechaGeneracion,
      totalDenuncias: totalDenuncias,
      menos3Dias: {
        cantidad: indicadorBackend.menor3Dias,
        porcentaje: Number(indicadorBackend.porcentajeMenor3?.toFixed(1) || 0)
      },
      entre3y5Dias: {
        cantidad: indicadorBackend.entre3y5Dias,
        porcentaje: Number(indicadorBackend.porcentaje3y5?.toFixed(1) || 0)
      },
      entre5y10Dias: {
        cantidad: indicadorBackend.entre5y10Dias,
        porcentaje: Number(indicadorBackend.porcentaje5y10?.toFixed(1) || 0)
      },
      mas10Dias: {
        cantidad: indicadorBackend.mayor10Dias,
        porcentaje: Number(indicadorBackend.porcentajeMayor10?.toFixed(1) || 0)
      },
      requiereAuditoria: (indicadorBackend.porcentajeMayor10 || 0) > 50.0
    };
  }
}

export default ManagementIndicatorService;