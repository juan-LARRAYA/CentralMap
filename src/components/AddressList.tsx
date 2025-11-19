import { AddressInput } from './AddressInput';
import type { AddressListProps } from '../types';
import './AddressList.css';

export const AddressList: React.FC<AddressListProps> = ({
  addresses,
  onAddressChange,
  onAddAddress,
  onRemoveAddress,
}) => {
  return (
    <div className="addresses-container">
      <div className="addresses-list">
        {addresses.map((address) => (
          <AddressInput
            key={address.id}
            address={address}
            onAddressChange={onAddressChange}
            onRemove={addresses.length > 1 ? onRemoveAddress : undefined}
            showRemoveButton={addresses.length > 1}
          />
        ))}
      </div>

      <div className="button-container">
        <button
          type="button"
          onClick={onAddAddress}
          className="btn btn-secondary"
          aria-label="Agregar nueva dirección"
        >
          Agregar Dirección
        </button>
      </div>
    </div>
  );
};
