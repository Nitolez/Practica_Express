//PINTAR MAPA

const map = L.map('map').setView([51.505, -0.09], 13); //Este ultimo valor es el zoom

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, //zoom maximo del mapa
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map); //añado al mapa, si quiero otro estilo quito este

//CUidado si necesita api key
//Se pone el addTo(map) al final

/* const marker = L.marker([51.5, -0.09]).addTo(map); //Marcadores

 const circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map); //para hacer circulos de seleccion en el mapa

const polygon = L.polygon([
    [51.509, -0.08], //cada coordenada es un vertice nuevo
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map); //Para hacer poligonos

const popup = L.popup()
    .setLatLng([51.513, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);//Para hacer POP UPS

*/

//PETICION A API TERREMOTOS

//const allProperties = [];

const apiTerremotos = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

const getTerremotosID = async () => {
    try {
        const resp = await fetch("./text.json");
        const data = await resp.json();
        const id = data.features.map(feature => feature.id);
        return id;
    } catch (error) {
        console.log('Error');
        throw error; // Pasa el error al siguiente bloque catch
    }
};

const getTerremotosData = async (id) => {
    try {
        if(id === 'ci40614479'){
            id = 0;
        } else {
        const resp = await fetch(`https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/${id}.geojson`);
        const data = await resp.json();
        const propiedadesTerremoto = data.properties.products.origin[0].properties;
        //allProperties.push(propiedadesTerremoto);
        return propiedadesTerremoto; // Retorna solo la propiedad que quieres agregar a allProperties
        }
    } catch (error) {
        console.log('Error');
        throw error; // Pasa el error al siguiente bloque catch
    }
};

getTerremotosID()
    .then(async (resp) => {
        // Mapea las llamadas a getTerremotosData y espera a que todas las promesas se resuelvan
        const promises = resp.map(element => getTerremotosData(element));
        return Promise.all(promises);
    })
    .then(allProperties => {
        console.log(allProperties); // Aquí tienes todas las propiedades de los terremotos
        allProperties.forEach(element => {
            if (element) {
                pintarMapa(element.latitude, element.longitude, element.depth, element.title, element.eventtime, element.title, element.eventsourcecode, element.magnitude)
            }
        });
    })
    .catch(error => {
        console.log("error");
    });


const pintarMapa = (lat, long, depth, titulo, fecha, ubi, codigo, magnitud) => {
    const marker = L.marker([lat, long]).addTo(map); //Marcadores

    const circle = L.circle([lat, long], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: depth * 1000
    }).addTo(map); //para hacer circulos de seleccion en el mapa

    const popup = L.popup()

    circle.on('click', () => {
        popup
            .setLatLng([lat, long])
            .setContent(`TITULO: ${titulo}. FECHA: ${fecha}. UBICACION: ${ubi}. CODIGO: ${codigo}. MAGNITUD: ${magnitud}`)
            .openOn(map)//Para hacer POP UPS
    })
    marker.on('click', () => {
        popup
            .setLatLng([lat, long])
            .setContent(`TITULO: ${titulo}. FECHA: ${fecha}. UBICACION: ${ubi}. CODIGO: ${codigo}. MAGNITUD: ${magnitud}`)
            .openOn(map)//Para hacer POP UPS
    })
}