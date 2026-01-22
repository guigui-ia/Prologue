
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, ...props }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-xs uppercase tracking-widest text-slate-400 font-header">{label}</label>
      <select
        {...props}
        className="bg-slate-900 border border-slate-800 text-slate-200 rounded-md p-3 focus:outline-none focus:border-slate-600 transition-colors cursor-pointer appearance-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
