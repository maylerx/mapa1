document.getElementById('exportar-btn').addEventListener('click', function () {
    fetch('/exportar', {
        method: 'GET',
    })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'exportacion.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        .catch(error => console.error('Error al exportar a CSV:', error));
});

//permite descargar la plantilla para la importacio'n de los egresados
document.getElementById('descargarPlantilla-btn').addEventListener('click', function () {
    fetch('/downloadTemplate', {
        method: 'GET',
    })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'plantilla.ods';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        .catch(error => console.error('Error al descargar la plantilla:', error));
});