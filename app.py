from flask import Flask, request, jsonify
from flask_cors import CORS  # Importa la extensión CORS
import requests
import time

app = Flask(__name__)
CORS(app)  # Habilita CORS para toda la app

def get_coordinates_osm(address):
    url = f"https://nominatim.openstreetmap.org/search?q={address}&format=json&limit=1"
    try:
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; OpenStreetMap Python Script)'})
        response.raise_for_status()
        data = response.json()
        if data:
            lat = float(data[0]['lat'])
            lon = float(data[0]['lon'])
            return lat, lon
        else:
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def calculate_center_of_mass(coordinates):
    lat_sum = sum(lat for lat, lon in coordinates)
    lon_sum = sum(lon for lat, lon in coordinates)
    
    center_lat = lat_sum / len(coordinates)
    center_lon = lon_sum / len(coordinates)
    
    return center_lat, center_lon

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    addresses = data['addresses']

    coordinates = []
    for address in addresses:
        coords = get_coordinates_osm(address)
        if coords is not None:
            coordinates.append(coords)
        time.sleep(1)

    if coordinates:
        center_of_mass = calculate_center_of_mass(coordinates)
        return jsonify({"center": center_of_mass})
    else:
        return jsonify({"error": "No se pudieron obtener suficientes coordenadas"}), 400

if __name__ == '__main__':
    app.run(debug=True)
