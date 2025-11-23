import '@testing-library/jest-dom';

// Mock Leaflet for tests
global.L = {
  map: vi.fn(() => ({
    setView: vi.fn().mockReturnThis(),
    remove: vi.fn(),
  })),
  tileLayer: vi.fn(() => ({
    addTo: vi.fn(),
  })),
  marker: vi.fn(() => ({
    addTo: vi.fn(),
    setLatLng: vi.fn(),
  })),
} as any;
