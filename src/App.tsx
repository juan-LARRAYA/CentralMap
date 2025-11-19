import { useState, useCallback, useMemo } from 'react';
import { AddressList } from './components/AddressList';
import { MapView } from './components/MapView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useGeocoding } from './hooks/useGeocoding';
import { calculateCenterOfMass, formatCoordinates } from './utils/calculations';
import type { Address, Coordinates } from './types';
import './App.css';

const DEFAULT_CENTER: Coordinates = { lat: -34.6037, lon: -58.3816 }; // Buenos Aires

function App() {
  const [addresses, setAddresses] = useState<Address[]>([
    { id: crypto.randomUUID(), value: '' },
  ]);
  const [center, setCenter] = useState<Coordinates>(DEFAULT_CENTER);
  const [result, setResult] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);
  const { geocode, error, clearError } = useGeocoding();

  const handleAddressChange = useCallback((id: string, value: string) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === id ? { ...addr, value } : addr))
    );
  }, []);

  const handleAddAddress = useCallback(() => {
    setAddresses((prev) => [...prev, { id: crypto.randomUUID(), value: '' }]);
  }, []);

  const handleRemoveAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  }, []);

  const handleCalculate = useCallback(async () => {
    clearError();
    setIsCalculating(true);
    setResult('Calculando...');

    const coordinates: Coordinates[] = [];
    const updatedAddresses: Address[] = [];

    for (const address of addresses) {
      const trimmedValue = address.value.trim();

      if (!trimmedValue) {
        updatedAddresses.push(address);
        continue;
      }

      try {
        const coords = await geocode(trimmedValue);

        if (coords) {
          coordinates.push(coords);
          updatedAddresses.push({
            ...address,
            coordinates: coords,
          });
        } else {
          updatedAddresses.push({
            ...address,
            error: 'No se encontraron resultados',
          });
        }
      } catch (err) {
        updatedAddresses.push({
          ...address,
          error: 'Error al geocodificar',
        });
      }
    }

    setAddresses(updatedAddresses);

    if (coordinates.length > 0) {
      const centerResult = calculateCenterOfMass(coordinates);

      if (centerResult) {
        const newCenter: Coordinates = {
          lat: centerResult.centerLat,
          lon: centerResult.centerLon,
        };
        setCenter(newCenter);
        setResult(
          `Ubicación central (Latitud, Longitud):\n${formatCoordinates(newCenter)}`
        );
      }
    } else {
      setResult(
        'No se obtuvieron suficientes coordenadas para calcular el centro de masa.'
      );
    }

    setIsCalculating(false);
  }, [addresses, geocode, clearError]);

  const hasValidAddresses = useMemo(() => {
    return addresses.some((addr) => addr.value.trim().length > 0);
  }, [addresses]);

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="header">
          <h1 className="title">CentralMap</h1>
          <h2 className="subtitle">El lugar del encuentro.</h2>
        </header>

        <main className="container">
          <AddressList
            addresses={addresses}
            onAddressChange={handleAddressChange}
            onAddAddress={handleAddAddress}
            onRemoveAddress={handleRemoveAddress}
          />

          <div className="button-container">
            <button
              type="button"
              onClick={handleCalculate}
              disabled={!hasValidAddresses || isCalculating}
              className="btn btn-primary"
              aria-label="Calcular centro de masa"
            >
              {isCalculating ? 'Calculando...' : 'Calcular Centro de Masa'}
            </button>
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {result && !error && (
            <div className="result" id="result">
              {result.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}

          <MapView
            center={center}
            addresses={addresses.filter((addr) => addr.coordinates)}
            zoom={13}
          />
        </main>

        <footer className="footer">
          Desarrollado por Juan Cruz Larraya. Visita mi{' '}
          <a
            href="https://github.com/juan-LARRAYA"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>{' '}
          y{' '}
          <a
            href="https://www.linkedin.com/in/juan-cruz-larraya/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          .
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
