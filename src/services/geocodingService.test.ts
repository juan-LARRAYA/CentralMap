import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCoordinates, getSuggestions } from './geocodingService';

// Mock fetch globally
global.fetch = vi.fn();

describe('geocodingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getCoordinates', () => {
    it('should return coordinates for a valid address', async () => {
      const mockResponse = [
        {
          lat: '-34.6037',
          lon: '-58.3816',
          display_name: 'Buenos Aires, Argentina',
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const promise = getCoordinates('Buenos Aires, Argentina');
      vi.runAllTimers();
      const result = await promise;

      expect(result).toEqual({ lat: -34.6037, lon: -58.3816 });
    });

    it('should return null for empty address', async () => {
      const result = await getCoordinates('');
      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return null when no results found', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const promise = getCoordinates('InvalidAddress123456789');
      vi.runAllTimers();
      const result = await promise;

      expect(result).toBeNull();
    });

    it('should throw error on API failure', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const promise = getCoordinates('Test Address');
      vi.runAllTimers();

      await expect(promise).rejects.toThrow('Nominatim API error');
    });
  });

  describe('getSuggestions', () => {
    it('should return suggestions for valid query', async () => {
      const mockResponse = [
        {
          lat: '-34.6037',
          lon: '-58.3816',
          display_name: 'Buenos Aires, Argentina',
        },
        {
          lat: '-34.9011',
          lon: '-56.1645',
          display_name: 'Buenos Aires, Uruguay',
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const promise = getSuggestions('Buenos Aires');
      vi.runAllTimers();
      const result = await promise;

      expect(result).toHaveLength(2);
      expect(result[0].display_name).toBe('Buenos Aires, Argentina');
    });

    it('should return empty array for short query', async () => {
      const result = await getSuggestions('BA');
      expect(result).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return empty array on error', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const promise = getSuggestions('Test Query');
      vi.runAllTimers();
      const result = await promise;

      expect(result).toEqual([]);
    });
  });
});
