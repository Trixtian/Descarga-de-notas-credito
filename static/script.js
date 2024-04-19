var alertContainer = document.getElementById("alertContainer");

function mostrarAlerta(mensaje, tipo, loader = false) {
    alertContainer.innerHTML = '';  // Limpiar el contenedor de alertas
    var alerta = document.createElement("div");
    alerta.className = "alert " + tipo;
    alerta.textContent = mensaje;
    if (loader) {
        var spinner = document.createElement("div");
        spinner.className = "loader";
        alerta.appendChild(spinner);
    }
    alertContainer.appendChild(alerta);
}

function descargarDatos() {
    var fechaInicio = document.getElementById("fecha_inicio").value;
    var fechaFin = document.getElementById("fecha_fin").value;
    if (!fechaInicio || !fechaFin) {
        mostrarAlerta("Seleccione las fechas de inicio y fin.", "alert-danger");
        return;
    }
    var dateInicio = new Date(fechaInicio);
    var dateFin = new Date(fechaFin);
    if (dateInicio >= dateFin) {
        mostrarAlerta("La fecha de inicio debe ser anterior a la fecha de fin.", "alert-danger");
        return;
    }

    mostrarAlerta("Procesando descarga...", "alert-primary", true);

    const formData = new FormData();
    formData.append('fecha_inicio', fechaInicio);
    formData.append('fecha_fin', fechaFin);

    fetch('/download', {
        method: 'POST',
        body: formData
    })
    .then(async response => {
        if (response.ok) {
            const blob = await response.blob();
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = `Notas_credito_${fechaInicio.replaceAll('-', '')}_${fechaFin.replaceAll('-', '')}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            mostrarAlerta("Archivo descargado exitosamente.", "alert-success");
        } else if (response.status === 102) {
            mostrarAlerta(await response.text(), "alert-danger");
        } else {
            mostrarAlerta("Las fechas seleccionadas no poseen datos.", "alert-danger");
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        mostrarAlerta("Las fechas seleccionadas no poseen datos.", "alert-danger");
    });
}

document.getElementById("downloadBtn").addEventListener("click", descargarDatos);