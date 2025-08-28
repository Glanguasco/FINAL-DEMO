document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("onboardingForm");
  const successMessage = document.getElementById("successMessage");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Capturar todos los datos del formulario (manteniendo estructura original)
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value.trim();
    }

    // Crear objeto cliente con estructura para dashboard
    const clienteCompleto = {
      // Datos base para dashboard
      id: generarIdUnico(),
      codigo: generarCodigoReferencia(),
      tipo: 'ecommerce',
      empresa: data.nombreEmpresa || 'Sin nombre',
      contacto: 'Cliente E-commerce',
      email: generarEmailTemporal(data.nombreEmpresa),
      telefono: generarTelefonoTemporal(),
      timestamp: new Date().toISOString(),
      estado: 'completado',
      
      // Datos específicos de e-commerce para el dashboard
      rubro: data.rubro,
      cantidadProductos: data.cantidadProductos,
      plataforma: data.plataforma,
      pedidosMensuales: data.pedidosMensuales,
      
      // Datos originales del formulario (sin cambios)
      datosOriginales: data
    };

    // Guardar en localStorage para dashboard (clave unificada)
    const submissions = JSON.parse(localStorage.getItem("botiaSubmissions") || "[]");
    submissions.push(clienteCompleto);
    localStorage.setItem("botiaSubmissions", JSON.stringify(submissions));

    // Mantener también el localStorage original (para compatibilidad)
    const submissionsOriginal = JSON.parse(localStorage.getItem("onboardingSubmissions") || "[]");
    submissionsOriginal.push({ 
      id: Date.now(), 
      date: new Date().toLocaleString(), 
      data: data 
    });
    localStorage.setItem("onboardingSubmissions", JSON.stringify(submissionsOriginal));

    // Mostrar código de referencia en mensaje de éxito
    const codeElement = document.getElementById('referenceCode');
    if (codeElement) {
      codeElement.textContent = clienteCompleto.codigo;
    }

    // Generar PDF del formulario
    generarPDF(data, clienteCompleto.codigo);

    // Mostrar en consola (manteniendo línea original)
    console.log("✅ Respuesta guardada:", data);
    console.log("📊 Datos para dashboard:", clienteCompleto);

    // Ocultar formulario y mostrar mensaje de éxito (original)
    form.style.display = "none";
    successMessage.style.display = "block";

    // Opcional: redirigir o enviar a servidor (comentario original mantenido)
    // Aquí puedes llamar a fetch() para enviar a un backend
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
    if (!nombreEmpresa) return 'cliente@ecommerce.com';
    const empresa = nombreEmpresa.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 10);
    return `${empresa}@ecommerce.com`;
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
          <title>Onboarding E-commerce - ${codigo}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
            .header { text-align: center; border-bottom: 2px solid #005fdd; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { color: #005fdd; margin: 0; }
            .section { margin-bottom: 20px; page-break-inside: avoid; }
            .section h3 { color: #005fdd; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .field { margin-bottom: 8px; }
            .field strong { display: inline-block; width: 200px; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BOTIA.TECH</h1>
            <h2>Onboarding E-commerce</h2>
            <p><strong>Código de Referencia:</strong> ${codigo}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <h3>Información General</h3>
            <div class="field"><strong>Empresa:</strong> ${data.nombreEmpresa}</div>
            <div class="field"><strong>Rubro:</strong> ${data.rubro}</div>
            <div class="field"><strong>Público Objetivo:</strong> ${data.publico}</div>
          </div>

          <div class="section">
            <h3>Productos</h3>
            <div class="field"><strong>Cantidad de Productos:</strong> ${data.cantidadProductos}</div>
            <div class="field"><strong>Variaciones:</strong> ${data.variaciones}</div>
            <div class="field"><strong>Contenido Listo:</strong> ${data.contenidoListo}</div>
          </div>

          <div class="section">
            <h3>Plataforma y Operaciones</h3>
            <div class="field"><strong>Plataforma:</strong> ${data.plataforma}</div>
            <div class="field"><strong>Inventario:</strong> ${data.inventario}</div>
            <div class="field"><strong>Pedidos Mensuales:</strong> ${data.pedidosMensuales}</div>
          </div>

          <div class="section">
            <h3>Logística</h3>
            <div class="field"><strong>Métodos de Pago:</strong> ${data.metodosPago}</div>
            <div class="field"><strong>Política de Envíos:</strong> ${data.politicaEnvios}</div>
            <div class="field"><strong>Empresas de Envío:</strong> ${data.logistica}</div>
            <div class="field"><strong>Política de Cambios:</strong> ${data.politicaCambios}</div>
          </div>

          <div class="section">
            <h3>Atención al Cliente</h3>
            <div class="field"><strong>Dudas Frecuentes:</strong> ${data.dudasFrecuentes}</div>
            <div class="field"><strong>Canales de Soporte:</strong> ${data.canalesSoporte}</div>
            <div class="field"><strong>Fidelización:</strong> ${data.fidelizacion || 'No especificado'}</div>
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
      a.download = `Botia-Ecommerce-${codigo}.html`;
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Limpiar URL temporal
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      console.log("📄 PDF (HTML) descargado exitosamente:", `Botia-Ecommerce-${codigo}.html`);
      
      // Mostrar notificación al usuario
      alert(`¡PDF generado! Se descargó como: Botia-Ecommerce-${codigo}.html\n\nPuedes abrir el archivo y usar Ctrl+P para imprimir.`);
      
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar PDF. Los datos se guardaron correctamente.");
    }
  }
});