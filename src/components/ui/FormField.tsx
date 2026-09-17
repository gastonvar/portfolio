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
  const baseClassName = "w-full border-0 border-b border-zinc-800 bg-transparent px-0 py-2.5 text-zinc-100 placeholder-zinc-600 transition-colors duration-200 focus:outline-none";
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
        className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500"
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
