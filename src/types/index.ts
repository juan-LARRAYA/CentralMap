/**
 * Represents geographical coordinates
 */
export interface Coordinates {
  lat: number;
  lon: number;
}

/**
 * Represents an address with its geocoded location
 */
export interface Address {
  id: string;
  value: string;
  coordinates?: Coordinates;
  isLoading?: boolean;
  error?: string;
}

/**
 * Response from Nominatim geocoding API
 */
export interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
  };
}

/**
 * Suggestion for address autocomplete
 */
export interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

/**
 * Center of mass calculation result
 */
export interface CenterResult {
  centerLat: number;
  centerLon: number;
}

/**
 * Error state for components
 */
export interface ErrorState {
  hasError: boolean;
  message: string;
}

/**
 * Props for AddressInput component
 */
export interface AddressInputProps {
  address: Address;
  onAddressChange: (id: string, value: string) => void;
  onRemove?: (id: string) => void;
  showRemoveButton?: boolean;
}

/**
 * Props for AddressList component
 */
export interface AddressListProps {
  addresses: Address[];
  onAddressChange: (id: string, value: string) => void;
  onAddAddress: () => void;
  onRemoveAddress: (id: string) => void;
}

/**
 * Props for MapView component
 */
export interface MapViewProps {
  center: Coordinates;
  addresses: Address[];
  zoom?: number;
}

/**
 * Props for ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Geocoding service interface
 */
export interface GeocodingService {
  getCoordinates: (address: string) => Promise<Coordinates | null>;
  getSuggestions: (query: string) => Promise<AddressSuggestion[]>;
}
