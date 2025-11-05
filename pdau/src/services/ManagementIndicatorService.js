class ManagementIndicatorService {
  // Generar indicadores de tiempo de respuesta
  static async generateResponseTimeIndicators() {
    try {
      const response = await fetch('/api/management-indicators/response-times', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al generar indicadores');
      }
      
      const result = await response.json();
      
      // Verificar si se necesita enviar notificación
      if (result.requiresNotification) {
        await this.sendAuditNotification(result);
      }
      
      return result;
    } catch (error) {
      console.error('Error generating indicators:', error);
      throw error;
    }
  }

  // Obtener historial de indicadores
  static async getIndicatorsHistory() {
    try {
      // DATOS ESTÁTICOS PARA VISUALIZACIÓN
      const datosEstaticos = [
        {
          id: 1,
          fechaGeneracion: "2025-03-30T10:00:00",
          totalDenuncias: 175,
          menos3Dias: { cantidad: 45, porcentaje: 25.7 },
          entre3y5Dias: { cantidad: 62, porcentaje: 35.4 },
          entre5y10Dias: { cantidad: 38, porcentaje: 21.7 },
          mas10Dias: { cantidad: 30, porcentaje: 17.1 },
          requiereAuditoria: false
        },
        {
          id: 2,
          fechaGeneracion: "2025-03-25T09:30:00",
          totalDenuncias: 168,
          menos3Dias: { cantidad: 40, porcentaje: 23.8 },
          entre3y5Dias: { cantidad: 58, porcentaje: 34.5 },
          entre5y10Dias: { cantidad: 35, porcentaje: 20.8 },
          mas10Dias: { cantidad: 35, porcentaje: 20.8 },
          requiereAuditoria: false
        },
        {
          id: 3,
          fechaGeneracion: "2025-03-20T14:15:00", 
          totalDenuncias: 160,
          menos3Dias: { cantidad: 35, porcentaje: 21.9 },
          entre3y5Dias: { cantidad: 50, porcentaje: 31.3 },
          entre5y10Dias: { cantidad: 30, porcentaje: 18.8 },
          mas10Dias: { cantidad: 45, porcentaje: 28.1 },
          requiereAuditoria: false
        },
        {
          id: 4,
          fechaGeneracion: "2025-03-15T11:45:00",
          totalDenuncias: 155,
          menos3Dias: { cantidad: 30, porcentaje: 19.4 },
          entre3y5Dias: { cantidad: 45, porcentaje: 29.0 },
          entre5y10Dias: { cantidad: 25, porcentaje: 16.1 },
          mas10Dias: { cantidad: 55, porcentaje: 35.5 },
          requiereAuditoria: true
        }
      ];

      return new Promise((resolve) => {
        setTimeout(() => resolve(datosEstaticos), 800);
      });

      // CÓDIGO REAL COMENTADO
      /*
      const response = await fetch('/api/management-indicators/history');
      if (!response.ok) {
        throw new Error('Error al obtener historial');
      }
      return await response.json();
      */
    } catch (error) {
      console.error('Error fetching indicators history:', error);
      throw error;
    }
  }

  // Enviar notificación de auditoría
  static async sendAuditNotification(indicatorsData) {
    try {
      const notificationData = {
        subject: '🚨 ALERTA: Auditoría Requerida - Tiempos de Respuesta',
        message: `El ${indicatorsData.mas10Dias.porcentaje}% de las denuncias han tardado más de 10 días en ser respondidas. Se requiere auditoría del área de control interno.`,
        indicators: indicatorsData,
        timestamp: new Date().toISOString()
      };

      // Simular envío de notificación
      console.log('📧 Enviando notificación de auditoría:', notificationData);
      
      // En implementación real, aquí iría el envío real del correo
      const response = await fetch('/api/notifications/audit-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData)
      });

      return await response.json();
    } catch (error) {
      console.error('Error sending audit notification:', error);
      // No lanzar error para no interrumpir el flujo principal
    }
  }
}

export default ManagementIndicatorService;