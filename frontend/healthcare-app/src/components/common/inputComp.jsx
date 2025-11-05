import React from 'react';
import "../../index.css"; // Đảm bảo Tailwind CSS được import

const InputComp = ({ 
    label, 
    type = "text",
    placeholder, 
    value, 
    onChange, 
    icon: Icon }) => {
        return(
        <div className="flex flex-col mb-4">
        {label && <label className="mb-2 font-semibold text-gray-700">{label}</label>}
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full px-3 py-2 border rounded ${Icon ? 'pl-10' : ''}`}
            />
        </div>
        </div>
        );
}

export default InputComp;