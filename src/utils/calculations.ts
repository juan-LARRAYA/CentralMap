import type { Coordinates, CenterResult } from '../types';

/**
 * Calculates the geographical center of mass (centroid) from an array of coordinates
 * Uses simple arithmetic mean for lat/lon (suitable for small areas)
 *
 * @param coordinates - Array of coordinate objects
 * @returns Center coordinates or null if array is empty
 */
export const calculateCenterOfMass = (coordinates: Coordinates[]): CenterResult | null => {
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  const sum = coordinates.reduce(
    (acc, coord) => ({
      latSum: acc.latSum + coord.lat,
      lonSum: acc.lonSum + coord.lon,
    }),
    { latSum: 0, lonSum: 0 }
  );

  return {
    centerLat: sum.latSum / coordinates.length,
    centerLon: sum.lonSum / coordinates.length,
  };
};

/**
 * Validates if coordinates are within valid ranges
 * Latitude: -90 to 90
 * Longitude: -180 to 180
 *
 * @param coordinates - Coordinates to validate
 * @returns true if coordinates are valid
 */
export const isValidCoordinates = (coordinates: Coordinates): boolean => {
  return (
    coordinates.lat >= -90 &&
    coordinates.lat <= 90 &&
    coordinates.lon >= -180 &&
    coordinates.lon <= 180
  );
};

/**
 * Calculates the distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 *
 * @param coord1 - First coordinate
 * @param coord2 - Second coordinate
 * @returns Distance in kilometers
 */
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLon = toRadians(coord2.lon - coord1.lon);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) *
      Math.cos(toRadians(coord2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Converts degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Formats coordinates to a readable string
 * @param coordinates - Coordinates to format
 * @param precision - Number of decimal places (default: 6)
 * @returns Formatted string
 */
export const formatCoordinates = (coordinates: Coordinates, precision = 6): string => {
  return `(${coordinates.lat.toFixed(precision)}, ${coordinates.lon.toFixed(precision)})`;
};
