import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function FormLabel({ children, required, className = "", ...props }: LabelProps) {
  return (
    <label
      className={`text-[10px] text-text-secondary uppercase tracking-widest font-mono font-bold block mb-1.5 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-accent-ai ml-1">*</span>}
    </label>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function FormInput({ error, className = "", ...props }: InputProps) {
  const baseInputStyles = "bg-bg-surface border border-border focus:border-accent-ai text-text-primary px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent-ai transition-colors font-sans text-xs w-full disabled:opacity-50";
  const errorStyles = error ? "border-error focus:border-error focus:ring-error" : "";
  const errorId = props.id ? `${props.id}-error` : undefined;

  return (
    <div className="w-full">
      <input
        className={`${baseInputStyles} ${errorStyles} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && <FormError id={errorId}>{error}</FormError>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export function FormTextarea({ error, className = "", ...props }: TextareaProps) {
  const baseTextareaStyles = "bg-bg-surface border border-border focus:border-accent-ai text-text-primary px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent-ai transition-colors font-sans text-xs w-full min-h-[100px] disabled:opacity-50";
  const errorStyles = error ? "border-error focus:border-error focus:ring-error" : "";
  const errorId = props.id ? `${props.id}-error` : undefined;

  return (
    <div className="w-full">
      <textarea
        className={`${baseTextareaStyles} ${errorStyles} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && <FormError id={errorId}>{error}</FormError>}
    </div>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: string;
}

export function FormSelect({ options, error, className = "", ...props }: SelectProps) {
  const baseSelectStyles = "bg-bg-surface border border-border focus:border-accent-ai text-text-primary px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent-ai transition-colors font-sans text-xs w-full disabled:opacity-50 cursor-pointer";
  const errorStyles = error ? "border-error focus:border-error focus:ring-error" : "";
  const errorId = props.id ? `${props.id}-error` : undefined;

  return (
    <div className="w-full">
      <select
        className={`${baseSelectStyles} ${errorStyles} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-bg-surface text-text-primary">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <FormError id={errorId}>{error}</FormError>}
    </div>
  );
}

export function FormError({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <span id={id} className="text-error font-mono text-[10px] uppercase tracking-wide mt-1 block animate-pulse">
      // ERROR: {children}
    </span>
  );
}
