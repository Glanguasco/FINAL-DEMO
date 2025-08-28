document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("onboardingForm");
  const successMessage = document.getElementById("successMessage");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Capturar datos del formulario (estructura original)
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Crear objeto cliente completo para dashboard
    const clienteCompleto = {
      // Información base para dashboard
      id: generarIdUnico(),
      codigo: generarCodigoReferencia(), 
      tipo: 'servicios',
      empresa: data.nombreEmpresa || 'Sin nombre',
      contacto: 'Cliente Servicios',
      email: generarEmailTemporal(data.nombreEmpresa),
      telefono: generarTelefonoTemporal(),
      timestamp: new Date().toISOString(),
      estado: 'completado',
      
      // Datos específicos del servicio
      tipoServicio: data.tipoServicio,
      publicoObjetivo: data.publicoObjetivo,
      clientesMensuales: data.clientesMensuales,
      gestionReservas: data.gestionReservas,
      canalesAtencion: data.canalesAtencion,
      
      // Datos completos originales
      datosOriginales: data
    };

    // Guardar en localStorage para dashboard
    const submissions = JSON.parse(localStorage.getItem("botiaSubmissions") || "[]");
    submissions.push(clienteCompleto);
    localStorage.setItem("botiaSubmissions", JSON.stringify(submissions));

    // Mantener compatibilidad con almacenamiento original
    const submissionsOriginal = JSON.parse(localStorage.getItem("onboardingSubmissions") || "[]");
    submissionsOriginal.push({
      id: Date.now(),
      date: new Date().toLocaleString(),
      data: data
    });
    localStorage.setItem("onboardingSubmissions", JSON.stringify(submissionsOriginal));

    // Mostrar código de referencia
    const codeElement = document.getElementById('referenceCode');
    if (codeElement) {
      codeElement.textContent = clienteCompleto.codigo;
    }

    // Generar PDF del formulario
    generarPDF(data, clienteCompleto.codigo);

    // Mostrar datos en consola (manteniendo línea original)
    console.log("Respuestas del cliente:", data);
    console.log("Datos para dashboard:", clienteCompleto);

    // Ocultar formulario y mostrar mensaje (estructura original)
    document.querySelector("form").style.display = "none";
    document.getElementById("successMessage").style.display = "block";

    // Aquí puedes agregar envío a Google Sheets, email, etc. (comentario original)
  });

  // Funciones auxiliares
  function generarIdUnico() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  function generarCodigoReferencia() {
    const año = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `BOT-${año}-${numero}`;
  }

  function generarEmailTemporal(nombreEmpresa) {
    if (!nombreEmpresa) return 'cliente@servicios.com';
    const empresa = nombreEmpresa.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 10);
    return `${empresa}@servicios.com`;
  }

  function generarTelefonoTemporal() {
    return '999' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  }

  function generarPDF(data, codigo) {
    try {
      // Crear contenido del PDF en formato HTML completo
      const contenido = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Onboarding Servicios - ${codigo}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
            .header { text-align: center; border-bottom: 2px solid #DA17E8; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { color: #DA17E8; margin: 0; }
            .section { margin-bottom: 20px; page-break-inside: avoid; }
            .section h3 { color: #DA17E8; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .field { margin-bottom: 8px; }
            .field strong { display: inline-block; width: 200px; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BOTIA.TECH</h1>
            <h2>Onboarding Servicios</h2>
            <p><strong>Código de Referencia:</strong> ${codigo}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <h3>Información General</h3>
            <div class="field"><strong>Empresa:</strong> ${data.nombreEmpresa}</div>
            <div class="field"><strong>Tipo de Servicio:</strong> ${data.tipoServicio}</div>
            <div class="field"><strong>Público Objetivo:</strong> ${data.publicoObjetivo}</div>
          </div>

          <div class="section">
            <h3>Servicios y Flujo</h3>
            <div class="field"><strong>Servicios a Automatizar:</strong> ${data.serviciosAutomatizar}</div>
            <div class="field"><strong>Información del Cliente:</strong> ${data.infoCliente}</div>
            <div class="field"><strong>Pasos Previos:</strong> ${data.pasosPrevios}</div>
            <div class="field"><strong>Clientes Mensuales:</strong> ${data.clientesMensuales}</div>
            <div class="field"><strong>Proceso Estandarizado:</strong> ${data.procesoEstandarizado}</div>
          </div>

          <div class="section">
            <h3>Agendamiento y Pagos</h3>
            <div class="field"><strong>Gestión de Reservas:</strong> ${data.gestionReservas}</div>
            <div class="field"><strong>Horarios en Tiempo Real:</strong> ${data.horariosEnTiempoReal}</div>
            <div class="field"><strong>Servicios Diferentes:</strong> ${data.serviciosDiferentes}</div>
            <div class="field"><strong>Métodos de Pago:</strong> ${data.metodosPago}</div>
            <div class="field"><strong>Política de Cancelaciones:</strong> ${data.politicaCancelaciones}</div>
          </div>

          <div class="section">
            <h3>Atención al Cliente</h3>
            <div class="field"><strong>Preguntas Frecuentes:</strong> ${data.preguntasFrecuentes}</div>
            <div class="field"><strong>Canales de Atención:</strong> ${data.canalesAtencion}</div>
            <div class="field"><strong>Herramientas Usadas:</strong> ${data.herramientasUsadas}</div>
            <div class="field"><strong>Automatizaciones Deseadas:</strong> ${data.automatizacionesDeseadas}</div>
          </div>

          <div class="section">
            <h3>Objetivos</h3>
            <div class="field"><strong>Objetivos de Automatización:</strong> ${data.objetivosAutomatizacion}</div>
            <div class="field"><strong>Planes de Crecimiento:</strong> ${data.planesCrecimiento}</div>
          </div>

          <div class="footer">
            <p>Documento generado automáticamente por BOTIA.TECH<br>
            ${new Date().toLocaleString()}</p>
          </div>
        </body>
        </html>
      `;

      // Crear archivo descargable
      const blob = new Blob([contenido], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Crear enlace de descarga
      const a = document.createElement('a');
      a.href = url;
      a.download = `Botia-Servicios-${codigo}.html`;
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Limpiar URL temporal
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      console.log("📄 PDF (HTML) descargado exitosamente:", `Botia-Servicios-${codigo}.html`);
      
      // Mostrar notificación al usuario
      alert(`¡PDF generado! Se descargó como: Botia-Servicios-${codigo}.html\n\nPuedes abrir el archivo y usar Ctrl+P para imprimir.`);
      
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar PDF. Los datos se guardaron correctamente.");
    }
  }
});