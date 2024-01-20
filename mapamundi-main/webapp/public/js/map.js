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

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// recorrer los pinesEgresados y agregarlos al mapa poniendo de descripción el nombre y apellidos	
pinesEgresados().then((egresados) => {
    egresados.forEach((egresado) => {
        L.marker([egresado.coord_x, egresado.coord_y]).addTo(map)
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
    });
});

// Para la busqueda de egresados
document.getElementById('egresado_buscar').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Previene el comportamiento por defecto del Enter en un formulario
        buscarEgresado(this.value);
    }
});
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
            <div class="d-flex flex-column">
                <div class="p-2">${egresadosEncontrados[i].nombres}, ${egresadosEncontrados[i].apellidos}</div>
                <div class="p-2"></div>
                <div class="p-2">Flex item 3</div>
            </div>
            `);
         }   
        if (encontrado == false) {
            alert("No se encontró el egresado")
        }
    });

}
function flyTo(x,y){
    map.flyTo([x,y], 16);
    L.map.getElementById().bindPopup().openPopup();
}


function buscarEgresado(nombreCompleto) {
    pinesEgresados().then((egresados) => {
        var encontrado = false;
        egresados.forEach((egresado) => {
            if ((egresado.email).toLowerCase().replace(/\s/g, '') === nombreCompleto.toLowerCase().replace(/\s/g, '')) {
                map.flyTo([egresado.coord_x, egresado.coord_y], 16);
                L.map.getElementById().bindPopup().openPopup();
                encontrado = true;
            }
        });
        if (encontrado == false) {
            alert("No se encontró el egresado")
        }
    });
}
