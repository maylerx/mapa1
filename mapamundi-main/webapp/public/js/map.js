const pinesEgresados = async () => {
    try {
        const response = await fetch('/datosEgresados')
        const data = await response.json()
        console.log("Datos de egresados: \n" + data)
        return data
    } catch (error) {
        console.log("Error en map.js" + error)
    }
}

var map = L.map('map').setView([4.547597653099881, -75.66383667974051], 13);

var markers = []; // Array para guardar los marcadores

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// recorrer los pinesEgresados y agregarlos al mapa poniendo de descripción el nombre y apellidos	
pinesEgresados().then((egresados) => {
    egresados.forEach((egresado) => {

        let marker = L.marker([egresado.coord_x, egresado.coord_y]).addTo(map)
            .bindPopup('<h5>Información de Egresado</h5>'+
                '<strong>Nombre Completo: </strong>' + egresado.nombres + ' ' + egresado.apellidos +
                '<br><strong>Direccion: </strong>'+ egresado.direccion +
                '<br><strong>País: </strong>'+ egresado.pais +
                '<br><strong>Departamento: </strong>'+ egresado.departamento +
                '<br><strong>Ciudad: </strong>'+ egresado.ciudad +
                '<br><strong>Celular: </strong>'+ egresado.cell +
                '<br><strong>Empresa: </strong>'+ egresado.empresa +
                '<br><strong>Cargo: </strong>'+ egresado.cargo +
                '<br><strong>Email: </strong>'+ egresado.email +
                '<br><strong>Año de Graduación: </strong>'+ egresado.year_graduacion +
                '<br><strong>Carrera Cursada: </strong>'+ egresado.carrera_cursada +
                '<br><strong>Portafolio: </strong><a href="'+egresado.portafolio_url+'">'+ egresado.portafolio_url +
                '</a><br><br><div style="text-align: center;"><img src="' 
                + egresado.imagen_url + 
                '" alt="La foto de usuario no está disponible y sólo la pueden observar los administradores" '+
                'style= "widht: 100px; height: 100px;"></div>');
         // Agregar el marcador al array
        markers.push({id: egresado.id, marker: marker});
    });
});

// Para la busqueda de egresados
document.getElementById('egresado_buscar').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Previene el comportamiento por defecto del Enter en un formulario
        buscarEgresado(this.value);
    }
});
function buscarEgresadoPorCoordenadas(coord_x , coord_y, id  , modalId = null){

    //En caso de que la funcion sea llamada desde un modal, el modal debe cerrarse
    if (modalId != null){
        var modalElement = document.getElementById(modalId);
        $(modalElement).modal('toggle');
    }
    mostrarEgresadoMapa(coord_x,coord_y,id);
}
// Para la busqueda de egresados
function buscarPorPalabraClaveAction(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Previene el comportamiento por defecto del Enter en un formulario
        buscarPorPalabraClave(event.target.value,"egresadosEncontrados");
        console.log(event.target.value);
    }
}
function buscarPorPalabraClave(palabraClave,selectId){
    pinesEgresados().then((egresados) => {
        let egresadosEncontrados = []
        var encontrado = false;
        egresados.forEach((egresado) => {
            if ((egresado.email).toLowerCase().replace(/\s/g, '') === palabraClave.toLowerCase().replace(/\s/g, '')
            || (egresado.nombres).toLowerCase().replace(/\s/g, '') === palabraClave.toLowerCase().replace(/\s/g, '')
            || (egresado.apellidos).toLowerCase().replace(/\s/g, '') === palabraClave.toLowerCase().replace(/\s/g, '')) {
                egresadosEncontrados.push(egresado);
                encontrado = true;
            }
        });
        $('#'+selectId).empty();
        for (let i = 0; i < egresadosEncontrados.length; i++) {
            $('#'+selectId).append(`

            <tr class="text-center">
                <td >${egresadosEncontrados[i].nombres}</td>
                <td>${egresadosEncontrados[i].apellidos} </td>
                <td >${egresadosEncontrados[i].cell}</td>
                <td >${egresadosEncontrados[i].email}</td>
                <td class="text-primary" onclick="buscarEgresadoPorCoordenadas(${egresadosEncontrados[i].coord_x},${egresadosEncontrados[i].coord_y},${egresadosEncontrados[i].id},'buscarEgrasadoModal')"><i class="fa fa-map-marker" aria-hidden="true"  style="font-size: 30px;"></i></td>

                
            </tr>
            `);
         }   
        if (encontrado == false) {
            alert("No se encontró el egresado")
        }
    });

}
// Para la busqueda de egresados
function filtrarUsuariosActualizarAction(event) {
    if (event.key === 'Enter') {

        $("#tablaFiltrarEgresadosActualizar").css("display", "block");
    $("#actualizarEgresadoform").css("display", "none");
        event.preventDefault(); // Previene el comportamiento por defecto del Enter en un formulario
        filtrarUsuariosActualizar(event.target.value,"egresadosactualizarfiltrados");
    }
}
function filtrarUsuariosActualizar(palabraClave,selectId){
    pinesEgresados().then((egresados) => {
        let egresadosEncontrados = []
        var encontrado = false;
        egresados.forEach((egresado) => {
            if ((egresado.email).toLowerCase().replace(/\s/g, '') === palabraClave.toLowerCase().replace(/\s/g, '')
            || (egresado.nombres).toLowerCase().replace(/\s/g, '') === palabraClave.toLowerCase().replace(/\s/g, '')
            || (egresado.apellidos).toLowerCase().replace(/\s/g, '') === palabraClave.toLowerCase().replace(/\s/g, '')) {
                egresadosEncontrados.push(egresado);
                encontrado = true;
            }
        });
        $('#'+selectId).empty();
        for (let i = 0; i < egresadosEncontrados.length; i++) {
            var $tableRow = $(`
            <tr class="text-center">
                <td>${egresadosEncontrados[i].nombres}</td>
                <td>${egresadosEncontrados[i].apellidos}</td>
                <td>${egresadosEncontrados[i].email}</td>
            </tr>
        `);
        $tableRow.click(() => seleccionarEgresadoActualizar(egresadosEncontrados[i]));
        $('#' + selectId).append($tableRow);
         }   
        if (encontrado == false) {
            alert("No se encontró el egresado")
        }
    });
}
function seleccionarEgresadoActualizar(egresadoInfo){
    $("#tablaFiltrarEgresadosActualizar").css("display", "none");
    $("#actualizarEgresadoform").css("display", "block");

    $("#emailActualizar").val(egresadoInfo.email);
    $("#nombresActualizar").val(egresadoInfo.nombres);
    $("#apellidosActualizar").val(egresadoInfo.apellidos);
    $("#direccionActualizar").val(egresadoInfo.direccion);
    $("#cellActualizar").val(egresadoInfo.cell);
    $("#empresaActualizar").val(egresadoInfo.empresa);
    $("#cargoActualizar").val(egresadoInfo.cargo);
    $("#coord_xActualizar").val(egresadoInfo.coord_x);
    $("#coord_yActualizar").val(egresadoInfo.coord_y);
    $("#portafolio_urlActualizar").val(egresadoInfo.portafolio_url);

}



function flyTo(x,y){
    map.flyTo([x,y], 16);
    L.map.getElementById().bindPopup().openPopup();
    //let marker = markers.find(m => m.email === "juan.perez@example.com").marker;
    //marker.openPopup();
}
function mostrarEgresadoMapa(x,y,id ){
    map.flyTo([x,y], 16);
    let marker = markers.find(m => Number(m.id) == Number(id));
    if(marker != null )
        marker.marker.openPopup();
}

function buscarEgresado(nombreCompleto) {
    pinesEgresados().then((egresados) => {
        var encontrado = false;
        egresados.forEach((egresado) => {
            if ((egresado.email).toLowerCase().replace(/\s/g, '') === nombreCompleto.toLowerCase().replace(/\s/g, '')) {
                mostrarEgresadoMapa(egresado.coord_x,egresado.coord_y,egresado.id);
                encontrado = true;
            }
        });
        if (encontrado == false) {
            alert("No se encontró el egresado")
        }
    });
}
