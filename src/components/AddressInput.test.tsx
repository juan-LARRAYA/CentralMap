import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddressInput } from './AddressInput';
import type { Address } from '../types';

// Mock useGeocoding hook
vi.mock('../hooks/useGeocoding', () => ({
  useGeocoding: () => ({
    fetchSuggestions: vi.fn().mockResolvedValue([
      { display_name: 'Buenos Aires, Argentina', lat: '-34.6037', lon: '-58.3816' },
      { display_name: 'Córdoba, Argentina', lat: '-31.4201', lon: '-64.1888' },
    ]),
  }),
}));

describe('AddressInput', () => {
  const mockAddress: Address = {
    id: '1',
    value: '',
  };

  const mockOnAddressChange = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render input with placeholder', () => {
    render(
      <AddressInput
        address={mockAddress}
        onAddressChange={mockOnAddressChange}
      />
    );

    const input = screen.getByPlaceholderText(/ingrese una dirección/i);
    expect(input).toBeInTheDocument();
  });

  it('should call onAddressChange when input value changes', async () => {
    const user = userEvent.setup();

    render(
      <AddressInput
        address={mockAddress}
        onAddressChange={mockOnAddressChange}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'Buenos Aires');

    expect(mockOnAddressChange).toHaveBeenCalled();
  });

  it('should show remove button when showRemoveButton is true', () => {
    render(
      <AddressInput
        address={mockAddress}
        onAddressChange={mockOnAddressChange}
        onRemove={mockOnRemove}
        showRemoveButton={true}
      />
    );

    const removeButton = screen.getByRole('button', { name: /eliminar dirección/i });
    expect(removeButton).toBeInTheDocument();
  });

  it('should call onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <AddressInput
        address={mockAddress}
        onAddressChange={mockOnAddressChange}
        onRemove={mockOnRemove}
        showRemoveButton={true}
      />
    );

    const removeButton = screen.getByRole('button', { name: /eliminar dirección/i });
    await user.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledWith(mockAddress.id);
  });

  it('should display suggestions after typing', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ delay: null });

    render(
      <AddressInput
        address={mockAddress}
        onAddressChange={mockOnAddressChange}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'Buenos');

    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByText(/Buenos Aires, Argentina/i)).toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it('should update input value when suggestion is clicked', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ delay: null });

    render(
      <AddressInput
        address={mockAddress}
        onAddressChange={mockOnAddressChange}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'Buenos');

    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByText(/Buenos Aires, Argentina/i)).toBeInTheDocument();
    });

    const suggestion = screen.getByText(/Buenos Aires, Argentina/i);
    await user.click(suggestion);

    expect(mockOnAddressChange).toHaveBeenCalledWith(mockAddress.id, 'Buenos Aires, Argentina');

    vi.useRealTimers();
  });
});
