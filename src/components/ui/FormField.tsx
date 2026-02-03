'use client';

import React from 'react';

interface FormFieldProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'textarea';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  label: string;
  primaryColor: string;
  rows?: number;
}

/**
 * Reusable form field with custom styling
 */
export const FormField = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  label,
  primaryColor,
  rows = 6,
}: FormFieldProps) => {
  const baseClassName = "w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2";
  const baseStyle: React.CSSProperties & { '--tw-ring-color': string } = {
    '--tw-ring-color': primaryColor,
    borderColor: 'inherit',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = primaryColor;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = '';
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-zinc-300"
      >
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          className={baseClassName}
          style={baseStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={baseClassName}
          style={baseStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};
