import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  ariaLabel?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  size = 'sm',
  disabled = false,
  ariaLabel,
}) => {
  const isSm = size === 'sm';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
        isSm ? 'h-5 w-9' : 'h-6 w-11'
      } ${
        checked ? 'bg-blue-600' : 'bg-slate-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`pointer-events-none inline-block transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          isSm ? 'h-4 w-4' : 'h-5 w-5'
        } ${
          checked ? (isSm ? 'translate-x-4' : 'translate-x-5') : 'translate-x-0'
        }`}
      />
    </button>
  );
};
