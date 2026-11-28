export function LoadingSpinner({ size = 'md', className = '', label = 'Memuat...' }) {
  const sizeClasses = {
    xs: 'h-3.5 w-3.5 border-2',
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-[3px]',
  };

  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block animate-spin rounded-full border-current border-t-transparent ${sizeClasses[size] || sizeClasses.md} ${className}`}
    />
  );
}
