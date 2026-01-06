import React from 'react';

interface InputGroupProps {
  label: string;
  id: string;
  children: React.ReactNode;
  helperText?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, id, children, helperText }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      {children}
      {helperText && (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
};