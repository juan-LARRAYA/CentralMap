let map;
let marker;

let typingTimer; // Variable para almacenar el temporizador
const typingDelay = 400; // Tiempo de espera 400 milisegundos

const input = document.getElementById("addressInput");
// Configura el evento oninput en el JavaScript con un temporizador
input.oninput = () => {
    clearTimeout(typingTimer); // Limpia el temporizador anterior
    typingTimer = setTimeout(() => {
        autocompleteAddressStatic(); // Llama a la función después del retraso
    }, typingDelay);
};


//Hace la peticion de la latitud y longitud de una direccion ingresada
async function getCoordinatesOSM(address) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OpenStreetMap JavaScript Script)' }
        });
        if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                return { lat, lon };
            } else {
                alert(`No se encontraron resultados para la dirección: ${address}`);
                return null;
            }
        } else {
            alert(`Error en la solicitud a Nominatim. Código de estado: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error("Error al obtener los datos: ", error);
        return null;
    }
}
//calcula el centro de posicion de las coordenadas
function calculateCenterOfMass(coordinates) {
    let latSum = 0;
    let lonSum = 0;
    coordinates.forEach(coord => {
        latSum += coord.lat;
        lonSum += coord.lon;
    });
    const centerLat = latSum / coordinates.length;
    const centerLon = lonSum / coordinates.length;
    return { centerLat, centerLon };
}

//agrega un input para agregar mas direcciones
function addAddressInput() {
    const container = document.getElementById('addressesContainer');
    if (!container) return; // Verifica que el contenedor exista

    // Crear un nuevo contenedor para el input y la lista de sugerencias
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');

    // Crear el input de dirección
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Ingrese una dirección: Dirección, barrio, Ciudad, País';
    input.classList.add('address-input');

    // Crear la lista de sugerencias para este input
    const suggestionsList = document.createElement('ul');
    suggestionsList.classList.add('suggestions-list');

    // Asociar el evento oninput al input para activar la función de autocompletar
    //input.oninput = () => autocompleteAddress(input, suggestionsList);
    input.oninput = () => {
        clearTimeout(typingTimer); // Limpiamos cualquier temporizador previo
        typingTimer = setTimeout(() => {
            autocompleteAddress(input, suggestionsList); // Llamamos a la función después del retraso
        }, typingDelay);
    };


    // Añadir el input y la lista de sugerencias al contenedor de inputs
    inputContainer.appendChild(input);
    inputContainer.appendChild(suggestionsList);

    // Añadir el contenedor de input al contenedor principal
    container.appendChild(inputContainer);
    applyStyles(inputContainer);
}

async function calculate() {
    const inputs = document.querySelectorAll('.address-input');
    const coordinates = [];

    for (let input of inputs) {
        const address = input.value.trim();
        if (address) {
            const coords = await getCoordinatesOSM(address);
            if (coords !== null) {
                coordinates.push(coords);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    if (coordinates.length > 0) {
        const center = calculateCenterOfMass(coordinates);
        updateMap(center.centerLat, center.centerLon);
        document.getElementById('result').innerHTML = `Ubicación central (Latitud, Longitud): <br>(${center.centerLat}, ${center.centerLon})`;
    } else {
        document.getElementById('result').textContent = "No se obtuvieron suficientes coordenadas para calcular el centro de masa.";
    }
}

function updateMap(lat, lon) {
    if (!map) {
        map = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    } else {
        map.setView([lat, lon], 13);
    }

    if (marker) {
        marker.setLatLng([lat, lon]);
    } else {
        marker = L.marker([lat, lon]).addTo(map);
    }
}

async function autocompleteAddressStatic() {
    const input = document.getElementById("addressInput");
    const suggestionsList = document.getElementById("suggestionsList");
    if (input && suggestionsList) { // Verifica que los elementos existan
        autocompleteAddress(input, suggestionsList);
    }
}

async function autocompleteAddress(inputElement, suggestionsList) {
    const input = inputElement.value;
    
    suggestionsList.innerHTML = '';
    if (input.length < 4) {
        suggestionsList.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${input}&addressdetails=1&limit=4`);
        const data = await response.json();

        if (data.length > 0) {
            suggestionsList.style.display = 'block';
            suggestionsList.classList.add("with-border"); // Añade la clase cuando hay contenido

            data.forEach((place) => {
                const li = document.createElement("li");
                li.textContent = place.display_name;
                li.onclick = () => selectSuggestion(place.display_name, inputElement, suggestionsList);
                suggestionsList.appendChild(li);
            });
        } else {
            suggestionsList.style.display = 'none';
            suggestionsList.classList.remove("with-border"); // Quita la clase si no hay sugerencias
        }
    } catch (error) {
        console.error("Error al obtener sugerencias de Nominatim:", error);
    }
}


// Función para seleccionar una sugerencia
function selectSuggestion(suggestion, inputElement, suggestionsList) {
    inputElement.value = suggestion;
    suggestionsList.innerHTML = ''; // Limpia las sugerencias después de seleccionar una
}
