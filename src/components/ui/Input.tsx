import React from 'react';
import { clsx } from 'clsx';

interface InputProps {
  placeholder?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  variant?: 'default' | 'glass';
  type?: string;
  label?: string;
  error?: string;
  name?: string;
  readOnly?: boolean;
}

export function Input({ 
  placeholder, 
  value, 
  onChange, 
  className = '', 
  variant = 'default',
  type = 'text',
  label,
  error,
  name,
  readOnly = false
}: InputProps) {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors';
  
  const variantClasses = {
    default: 'border-gray-300 bg-white text-gray-900 placeholder-gray-500',
    glass: 'border-white/30 bg-white/20 text-gray-800 placeholder-gray-600 backdrop-blur-sm'
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  variant?: 'default' | 'glass'
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  variant = 'default',
  className,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  
  const variants = {
    default: 'border border-gray-300 bg-white focus:border-primary-500 focus:ring-primary-500',
    glass: 'glass-input focus:ring-primary-500 focus:border-primary-500'
  }

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={clsx(
          'block w-full px-3 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 resize-vertical',
          variants[variant],
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}