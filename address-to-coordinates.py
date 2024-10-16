from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Función para obtener las coordenadas de una dirección usando la API de OpenStreetMap
def get_coordinates_osm(address):
    url = f"https://nominatim.openstreetmap.org/search?q={address}&format=json&limit=1"
    response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; OpenStreetMap Python Script)'})
    
    if response.status_code == 200:
        data = response.json()
        if data:
            lat = float(data[0]['lat'])
            lon = float(data[0]['lon'])
            return {'lat': lat, 'lon': lon}
        else:
            return {'error': 'No se encontraron coordenadas para la dirección proporcionada.'}
    else:
        return {'error': 'Error en la solicitud a la API de OpenStreetMap.'}

# Ruta que manejará las solicitudes del frontend para múltiples direcciones
@app.route('/get-coordinates', methods=['POST'])
def get_coordinates():
    data = request.get_json()  # Recibir datos del frontend
    addresses = data.get('addresses', [])
    
    results = []
    for address in addresses:
        if address:
            result = get_coordinates_osm(address)
            results.append(result)
        else:
            results.append({'error': 'No se proporcionó una dirección.'})
    
    return jsonify(results)  # Enviar la lista de resultados en formato JSON

if __name__ == '__main__':
    app.run(debug=True)
