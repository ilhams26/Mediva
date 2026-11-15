export function Button({ 
  children, 
  variant = 'primary', 
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  ...props 
}) {
  const baseClasses = 'h-[38px] rounded-[5px] px-4 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mediva-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  
  const variantClasses = {
    primary: 'bg-mediva-primary text-white hover:bg-mediva-primary/90',
    secondary: 'border-2 border-mediva-primary bg-white text-mediva-primary hover:bg-mediva-primary/5',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
