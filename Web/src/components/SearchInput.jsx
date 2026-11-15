import { Icon } from '@iconify/react';
import './SearchInput.css';

export function SearchInput({ value, onChange, placeholder = 'Telusuri...' }) {
  return (
    <div className="search-input-wrapper">
      <Icon icon="mdi:magnify" className="search-icon" width={20} height={20} />
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
