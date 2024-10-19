let map;
let marker;

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

function addAddressInput() {
    const container = document.getElementById('addressesContainer');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Ingrese una dirección: Dirección, barrio, Ciudad, País';
    input.classList.add('address-input');
    container.appendChild(input);
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
        document.getElementById('result').textContent = `Centro de masa (Latitud, Longitud): (${center.centerLat}, ${center.centerLon})`;
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
