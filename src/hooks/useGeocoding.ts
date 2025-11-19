import { useState, useCallback } from 'react';
import { getCoordinates, getSuggestions } from '../services/geocodingService';
import type { Coordinates, AddressSuggestion } from '../types';

interface GeocodingState {
  isLoading: boolean;
  error: string | null;
}

interface UseGeocodingReturn {
  geocode: (address: string) => Promise<Coordinates | null>;
  fetchSuggestions: (query: string) => Promise<AddressSuggestion[]>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Hook for geocoding operations
 * Provides methods for geocoding addresses and fetching suggestions
 */
export const useGeocoding = (): UseGeocodingReturn => {
  const [state, setState] = useState<GeocodingState>({
    isLoading: false,
    error: null,
  });

  const geocode = useCallback(async (address: string): Promise<Coordinates | null> => {
    setState({ isLoading: true, error: null });

    try {
      const coordinates = await getCoordinates(address);

      if (!coordinates) {
        setState({ isLoading: false, error: `No se encontraron resultados para: ${address}` });
        return null;
      }

      setState({ isLoading: false, error: null });
      return coordinates;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al geocodificar la dirección';
      setState({ isLoading: false, error: errorMessage });
      return null;
    }
  }, []);

  const fetchSuggestions = useCallback(async (query: string): Promise<AddressSuggestion[]> => {
    if (query.length < 4) {
      return [];
    }

    try {
      const suggestions = await getSuggestions(query);
      return suggestions;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    geocode,
    fetchSuggestions,
    isLoading: state.isLoading,
    error: state.error,
    clearError,
  };
};
