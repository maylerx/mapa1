$(document).ready(function () {
    $('#formNuevoEgresado').submit(function (event) {
        event.preventDefault(); // Evita que se envíe el formulario de forma tradicional

        var formData = new FormData(this); // Obtiene los datos del formulario

        $.ajax({
            type: 'POST',
            url: '/agregarEgresado',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.alert) {
                    Swal.fire({
                        title: data.alertTitle,
                        text: data.alertMessage,
                        icon: data.alertIcon,
                        showConfirmButton: data.showConfirmButton,
                        timer: data.timer
                    }).then(() => {
                        if(data.ruta.length !=0)
                            window.location = '/' + data.ruta;
                    });
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});
$(document).ready(function () {
    $('#actualizarEgresadoform').submit(function (event) {
        event.preventDefault(); // Evita que se envíe el formulario de forma tradicional

        var formData = new FormData(this); // Obtiene los datos del formulario

        $.ajax({
            type: 'POST',
            url: '/actualizarEgresado',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.alert) {
                    Swal.fire({
                        title: data.alertTitle,
                        text: data.alertMessage,
                        icon: data.alertIcon,
                        showConfirmButton: data.showConfirmButton,
                        timer: data.timer
                    }).then(() => {
                        if(data.ruta.length !=0)
                            window.location = '/' + data.ruta;
                    });
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});
$(document).ready(function () {
    $('#formNuevoEgresadoborrar').submit(function (event) {
        event.preventDefault(); // Evita que se envíe el formulario de forma tradicional

        var formData = new FormData(this); // Obtiene los datos del formulario

        $.ajax({
            type: 'POST',
            url: '/borrarEgresado',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.alert) {
                    Swal.fire({
                        title: data.alertTitle,
                        text: data.alertMessage,
                        icon: data.alertIcon,
                        showConfirmButton: data.showConfirmButton,
                        timer: data.timer
                    }).then(() => {
                        if(data.ruta.length !=0)
                            window.location = '/' + data.ruta;
                    });
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});
$(document).ready(function () {
    var anioActual = new Date().getFullYear();
    for (var i = anioActual; i >= 1962; i--) {
        $('#year').append('<option value="' + i + '">' + i + '</option>');
        $('#yearActualizar').append('<option value="' + i + '">' + i + '</option>');
    }
});

$(document).ready(function () {
    const programas = [
        "Administración de Negocios a Distancia",
        "Administración de Negocios Presencial",
        "Administración Financiera a Distancia",
        "Artes Visuales",
        "Biología",
        "Ciencia de la Información y la Documentación, Bibliotecología y Archivística",
        "Comunicación Social - Periodismo",
        "Concurso Atención de Triage para Profesionales de la Salud",
        "Contaduría Pública",
        "Curso Especializado en Artes Plásticas",
        "Curso Especializado en Inglés para niños",
        "Curso Especializado en Música",
        "Curso Especializado en Teatro",
        "Curso Preuniversitario",
        "Diplomado en Docencia Universitaria",
        "Diplomado en Plantas Medicinales",
        "Diplomado en Prevención, Preparación y Respuesta a Emergencias Empresariales - PPREE",
        "Diplomado Gestión del Desarrollo Territorial",
        "Diplomado Vivencial en Pedagogía Emocional Comunitaria",
        "Doctorado en Ciencias",
        "Doctorado en Ciencias de la Educación",
        "Economía",
        "Enfermería",
        "Especialización en Administración Hospitalaria en Convenio con la Ean",
        "Especialización en Contabilidad Financiera Internacional",
        "Especialización en Gerencia Estratégica de la Auditoría Interna",
        "Especialización en Gerencia Tributaria Internacional",
        "Especialización en Pediatría",
        "Filosofía",
        "Física",
        "Gerontología",
        "Ingeniería Civil",
        "Ingeniería de Alimentos",
        "Ingeniería de Sistemas y Computación",
        "Ingeniería Electrónica",
        "Ingeniería Topográfica y Geomática",
        "Licenciatura en Ciencias Naturales y Educación Ambiental",
        "Licenciatura en Ciencias Sociales",
        "Licenciatura en Educación Física, Recreación y Deportes",
        "Licenciatura en Educación Infantil",
        "Licenciatura en Lenguas Modernas con énfasis en Inglés y Francés",
        "Licenciatura en Literatura y Lengua Castellana",
        "Licenciatura en Matemáticas",
        "Maestría en Administración",
        "Maestría en Agronegocios del Café",
        "Maestría en Auditoría y Control de Gestión",
        "Maestría en Biomatemáticas",
        "Maestría en Ciencias Biomédicas",
        "Maestría en Ciencias de la Educación",
        "Maestría en Gestión de Riesgo de Desastres",
        "Maestría en Ingeniería",
        "Maestría en Procesos Agroindustriales",
        "Medicina",
        "Química",
        "Seguridad y Salud en el Trabajo",
        "Tecnología en Instrumentación Electrónica",
        "Tecnología En Obras Civiles",
        "Trabajo Social",
        "Zootecnia"
    ];
    for (var i = 0; i < programas.length; i++) {
        $('#carrera_cursada').append('<option value="' + (i+1) + '">' + programas[i] + '</option>');
        $('#carrera_cursadaActualizar').append('<option value="' + (i+1) + '">' + programas[i] + '</option>');
    }

});

$(document).ready(function () {
    // Función para llenar el selector de países
    function cargarPaises() {
        $.ajax({
            url: `http://api.geonames.org/countryInfoJSON?username=sebasbp`,
            dataType: 'json',
            success: function (data) {
                for (let i = 0; i < data.geonames.length; i++) {
                    $('#pais').append(`<option value="${data.geonames[i].geonameId}">${data.geonames[i].countryName}</option>`);
                }
            }
        });
    }

    // Función para cargar los departamentos según el país seleccionado
    function cargarDepartamentos(paisId) {
        $('#departamento').empty();
        $.ajax({
            url: `http://api.geonames.org/childrenJSON?geonameId=${paisId}&username=sebasbp`,
            dataType: 'json',
            success: function (data) {
                for (let i = 0; i < data.geonames.length; i++) {
                    if (data.geonames[i].fcode === 'ADM1') {
                        $('#departamento').append(`<option value="${data.geonames[i].geonameId}">${data.geonames[i].name}</option>`);
                    }
                }
            }
        });
    }

    // Función para cargar las ciudades según el departamento seleccionado
    function cargarCiudades(deptoId) {
        $('#ciudad').empty();
        $.ajax({
            url: `http://api.geonames.org/childrenJSON?geonameId=${deptoId}&username=sebasbp`,
            dataType: 'json',
            success: function (data) {
                for (let i = 0; i < data.geonames.length; i++) {
                    if (data.geonames[i].fcode === 'ADM2') {
                        $('#ciudad').append(`<option value="${data.geonames[i].geonameId}">${data.geonames[i].name}</option>`);
                    }
                }
            }
        });
    }

    // Cargar lista de países al cargar la página
    cargarPaises();

    // Evento cuando se selecciona un país
    $('#pais').on('change', function () {
        const paisId = $(this).val();
        cargarDepartamentos(paisId);
    });

    // Evento cuando se selecciona un departamento
    $('#departamento').on('change', function () {
        const deptoId = $(this).val();
        cargarCiudades(deptoId);
    });
});



$(document).ready(function () {
    // Función para llenar el selector de países
    function cargarPaisesActualizar() {
        $.ajax({
            url: `http://api.geonames.org/countryInfoJSON?username=sebasbp`,
            dataType: 'json',
            success: function (data) {
                for (let i = 0; i < data.geonames.length; i++) {
                    $('#paisActualizar').append(`<option value="${data.geonames[i].geonameId}">${data.geonames[i].countryName}</option>`);
                }
            }
        });
    }

    // Función para cargar los departamentos según el país seleccionado
    function cargarDepartamentosActualizar(paisId) {
        $('#departamentoActualizar').empty();
        $.ajax({
            url: `http://api.geonames.org/childrenJSON?geonameId=${paisId}&username=sebasbp`,
            dataType: 'json',
            success: function (data) {
                for (let i = 0; i < data.geonames.length; i++) {
                    if (data.geonames[i].fcode === 'ADM1') {
                        $('#departamentoActualizar').append(`<option value="${data.geonames[i].geonameId}">${data.geonames[i].name}</option>`);
                    }
                }
            }
        });
    }

    // Función para cargar las ciudades según el departamento seleccionado
    function cargarCiudadesActualizar(deptoId) {
        $('#ciudadActualizar').empty();
        $.ajax({
            url: `http://api.geonames.org/childrenJSON?geonameId=${deptoId}&username=sebasbp`,
            dataType: 'json',
            success: function (data) {
                for (let i = 0; i < data.geonames.length; i++) {
                    if (data.geonames[i].fcode === 'ADM2') {
                        $('#ciudadActualizar').append(`<option value="${data.geonames[i].geonameId}">${data.geonames[i].name}</option>`);
                    }
                }
            }
        });
    }

    // Cargar lista de países al cargar la página
    cargarPaisesActualizar();

    // Evento cuando se selecciona un país
    $('#paisActualizar').on('change', function () {
        const paisId = $(this).val();
        cargarDepartamentosActualizar(paisId);
    });

    // Evento cuando se selecciona un departamento
    $('#departamentoActualizar').on('change', function () {
        const deptoId = $(this).val();
        cargarCiudadesActualizar(deptoId);
    });
});