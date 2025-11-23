import type { Coordinates, AddressSuggestion, NominatimResult } from '../types';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'Mozilla/5.0 (compatible; CentralMap Application)';

/**
 * Delay to respect Nominatim's rate limiting (1 request per second)
 */
const RATE_LIMIT_DELAY = 1000;

let lastRequestTime = 0;

/**
 * Ensures we don't exceed Nominatim's rate limit
 */
const respectRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    const delay = RATE_LIMIT_DELAY - timeSinceLastRequest;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  lastRequestTime = Date.now();
};

/**
 * Makes a request to the Nominatim API
 */
const nominatimFetch = async (endpoint: string, params: URLSearchParams): Promise<Response> => {
  await respectRateLimit();

  const url = `${NOMINATIM_BASE_URL}${endpoint}?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Nominatim API error: ${response.status} ${response.statusText}`);
  }

  return response;
};

/**
 * Gets coordinates for a given address using Nominatim API
 * @param address - The address to geocode
 * @returns Coordinates or null if not found
 */
export const getCoordinates = async (address: string): Promise<Coordinates | null> => {
  if (!address || address.trim().length === 0) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      q: address,
      format: 'json',
      limit: '1',
    });

    const response = await nominatimFetch('/search', params);
    const data: NominatimResult[] = await response.json();

    if (data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch coordinates'
    );
  }
};

/**
 * Gets address suggestions for autocomplete
 * @param query - The search query
 * @returns Array of address suggestions
 */
export const getSuggestions = async (query: string): Promise<AddressSuggestion[]> => {
  if (!query || query.trim().length < 4) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '4',
    });

    const response = await nominatimFetch('/search', params);
    const data: NominatimResult[] = await response.json();

    return data.map((item) => ({
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

/**
 * Default geocoding service implementation
 */
export const geocodingService = {
  getCoordinates,
  getSuggestions,
};
