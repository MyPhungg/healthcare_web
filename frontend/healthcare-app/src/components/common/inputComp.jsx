import React from 'react';
import "../../index.css";

const InputComp = ({ 
    label, 
    type = "text",
    placeholder, 
    value, 
    onChange, 
    name, // THÊM PROP NAME
    error, // THÊM PROP ERROR
    icon: Icon,
    className = "" 
}) => {
    return (
        <div className={`flex flex-col mb-4 ${className}`}>
            {label && <label className="mb-2 font-semibold text-gray-700">{label}</label>}
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />}
                <input
                    type={type}
                    name={name} // THÊM NAME VÀO INPUT
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange} // TRUYỀN EVENT TRỰC TIẾP
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        Icon ? 'pl-10' : 'pl-3'
                    } ${
                        error ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

export default InputComp;