import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useGeocoding } from '../hooks/useGeocoding';
import type { AddressInputProps, AddressSuggestion } from '../types';
import './AddressInput.css';

export const AddressInput: React.FC<AddressInputProps> = ({
  address,
  onAddressChange,
  onRemove,
  showRemoveButton = false,
}) => {
  const [inputValue, setInputValue] = useState(address.value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedValue = useDebounce(inputValue, 400);
  const { fetchSuggestions } = useGeocoding();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (debouncedValue.length >= 4) {
        const results = await fetchSuggestions(debouncedValue);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    loadSuggestions();
  }, [debouncedValue, fetchSuggestions]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onAddressChange(address.id, value);
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    setInputValue(suggestion.display_name);
    onAddressChange(address.id, suggestion.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(address.id);
    }
  };

  return (
    <div className="input-container">
      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Ingrese una dirección: Dirección, barrio, Ciudad, País"
          className="address-input"
          aria-label="Dirección"
          aria-describedby={showSuggestions ? `suggestions-${address.id}` : undefined}
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-controls={showSuggestions ? `suggestions-${address.id}` : undefined}
        />
        {showRemoveButton && (
          <button
            type="button"
            onClick={handleRemove}
            className="remove-button"
            aria-label="Eliminar dirección"
            title="Eliminar dirección"
          >
            ×
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={suggestionsRef}
          id={`suggestions-${address.id}`}
          className="suggestions-list"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="suggestion-item"
              role="option"
              aria-selected={false}
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
