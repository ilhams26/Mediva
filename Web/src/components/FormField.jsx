export const fieldControlClasses =
  'w-full rounded-mediva-sm border border-mediva-border-soft bg-white px-3.5 py-2.5 text-sm text-mediva-text placeholder:text-mediva-muted/70 transition-colors focus:border-mediva-primary focus:outline-none focus:ring-2 focus:ring-mediva-primary/20 disabled:cursor-not-allowed disabled:bg-mediva-page/50 disabled:text-mediva-muted';

export const fieldErrorClasses =
  'border-mediva-danger focus:border-mediva-danger focus:ring-mediva-danger/20';

export function FormField({
  label,
  htmlFor,
  required = false,
  helperText,
  error,
  children,
  className = '',
}) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="mb-1.5 block text-xs font-semibold text-mediva-text"
        >
          {label}
          {required && <span className="ml-0.5 text-mediva-danger">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1 text-xs font-medium text-mediva-danger-text">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-mediva-muted">{helperText}</p>
      ) : null}
    </div>
  );
}

export function TextInput({ error, className = '', ...props }) {
  return (
    <input
      className={`${fieldControlClasses} ${error ? fieldErrorClasses : ''} ${className}`}
      {...props}
    />
  );
}

export function SelectInput({ error, className = '', children, ...props }) {
  return (
    <select
      className={`${fieldControlClasses} ${error ? fieldErrorClasses : ''} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function TextareaInput({ error, className = '', ...props }) {
  return (
    <textarea
      className={`${fieldControlClasses} ${error ? fieldErrorClasses : ''} ${className}`}
      {...props}
    />
  );
}

export function CheckboxField({ label, description, className = '', ...props }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-mediva-sm border border-mediva-border-soft bg-mediva-page/30 px-3.5 py-2.5 text-sm text-mediva-text transition-colors hover:border-mediva-border ${className}`}
    >
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-mediva-border text-mediva-primary focus:ring-2 focus:ring-mediva-primary/30"
        {...props}
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-mediva-text">{label}</span>
        {description && <span className="block text-xs text-mediva-muted">{description}</span>}
      </span>
    </label>
  );
}
