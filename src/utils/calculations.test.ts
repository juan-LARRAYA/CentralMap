import { describe, it, expect } from 'vitest';
import {
  calculateCenterOfMass,
  isValidCoordinates,
  calculateDistance,
  formatCoordinates,
} from './calculations';
import type { Coordinates } from '../types';

describe('calculateCenterOfMass', () => {
  it('should calculate the center of mass for multiple coordinates', () => {
    const coordinates: Coordinates[] = [
      { lat: -34.6037, lon: -58.3816 }, // Buenos Aires
      { lat: -31.4201, lon: -64.1888 }, // Córdoba
    ];

    const result = calculateCenterOfMass(coordinates);

    expect(result).not.toBeNull();
    expect(result?.centerLat).toBeCloseTo(-33.0119, 2);
    expect(result?.centerLon).toBeCloseTo(-61.2852, 2);
  });

  it('should return null for empty array', () => {
    const result = calculateCenterOfMass([]);
    expect(result).toBeNull();
  });

  it('should return the same coordinates for a single point', () => {
    const coordinates: Coordinates[] = [{ lat: 40.7128, lon: -74.006 }];

    const result = calculateCenterOfMass(coordinates);

    expect(result).not.toBeNull();
    expect(result?.centerLat).toBe(40.7128);
    expect(result?.centerLon).toBe(-74.006);
  });

  it('should handle three points correctly', () => {
    const coordinates: Coordinates[] = [
      { lat: 0, lon: 0 },
      { lat: 0, lon: 3 },
      { lat: 3, lon: 0 },
    ];

    const result = calculateCenterOfMass(coordinates);

    expect(result).not.toBeNull();
    expect(result?.centerLat).toBe(1);
    expect(result?.centerLon).toBe(1);
  });
});

describe('isValidCoordinates', () => {
  it('should return true for valid coordinates', () => {
    expect(isValidCoordinates({ lat: 0, lon: 0 })).toBe(true);
    expect(isValidCoordinates({ lat: 45, lon: 90 })).toBe(true);
    expect(isValidCoordinates({ lat: -45, lon: -90 })).toBe(true);
    expect(isValidCoordinates({ lat: 90, lon: 180 })).toBe(true);
    expect(isValidCoordinates({ lat: -90, lon: -180 })).toBe(true);
  });

  it('should return false for invalid latitude', () => {
    expect(isValidCoordinates({ lat: 91, lon: 0 })).toBe(false);
    expect(isValidCoordinates({ lat: -91, lon: 0 })).toBe(false);
  });

  it('should return false for invalid longitude', () => {
    expect(isValidCoordinates({ lat: 0, lon: 181 })).toBe(false);
    expect(isValidCoordinates({ lat: 0, lon: -181 })).toBe(false);
  });
});

describe('calculateDistance', () => {
  it('should calculate distance between two points', () => {
    const buenosAires: Coordinates = { lat: -34.6037, lon: -58.3816 };
    const cordoba: Coordinates = { lat: -31.4201, lon: -64.1888 };

    const distance = calculateDistance(buenosAires, cordoba);

    // Distance between Buenos Aires and Córdoba is approximately 640 km
    expect(distance).toBeGreaterThan(630);
    expect(distance).toBeLessThan(650);
  });

  it('should return 0 for the same point', () => {
    const point: Coordinates = { lat: 40.7128, lon: -74.006 };
    const distance = calculateDistance(point, point);

    expect(distance).toBeCloseTo(0, 5);
  });

  it('should handle equator crossing', () => {
    const north: Coordinates = { lat: 10, lon: 0 };
    const south: Coordinates = { lat: -10, lon: 0 };

    const distance = calculateDistance(north, south);

    // Should be approximately 2222 km (20 degrees at equator)
    expect(distance).toBeGreaterThan(2200);
    expect(distance).toBeLessThan(2250);
  });
});

describe('formatCoordinates', () => {
  it('should format coordinates with default precision', () => {
    const coords: Coordinates = { lat: 40.712776, lon: -74.005974 };
    const formatted = formatCoordinates(coords);

    expect(formatted).toBe('(40.712776, -74.005974)');
  });

  it('should format coordinates with custom precision', () => {
    const coords: Coordinates = { lat: 40.712776, lon: -74.005974 };
    const formatted = formatCoordinates(coords, 2);

    expect(formatted).toBe('(40.71, -74.01)');
  });

  it('should handle negative coordinates', () => {
    const coords: Coordinates = { lat: -34.6037, lon: -58.3816 };
    const formatted = formatCoordinates(coords, 4);

    expect(formatted).toBe('(-34.6037, -58.3816)');
  });
});
