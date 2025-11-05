import React from 'react';

const FormField = ({ 
  icon: Icon, 
  label, 
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  as = 'input',
  options = [],
  rows = 4
}) => {
  return (
    <div className="mb-4">
      {/* Icon + Label */}
      <div className="flex items-center gap-2 mb-2">
        {Icon && (
          <div className="w-6 h-6 flex items-center justify-center">
            <Icon size={20} className="text-gray-700" />
          </div>
        )}
        <label className="text-gray-800 font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      {/* Input Field */}
      {as === 'input' && (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
        />
      )}

      {/* Select Field */}
      {as === 'select' && (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
        >
          <option value="">{placeholder || 'Chọn...'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {/* Textarea Field */}
      {as === 'textarea' && (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />
      )}
    </div>
  );
};

export default FormField;