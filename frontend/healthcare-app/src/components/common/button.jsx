import React from 'react';
import '../../index.css'; // Đảm bảo Tailwind CSS được import

const Button = ({ 
    text, 
    onClick,
    type = "button",
    children,
    icon: Icon,
    variant = "primary",
    fullWidth = false,
 }) => {
    const baseStyles = "px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-blue-500 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        danger: "bg-red-600 text-white hover:bg-red-700",
        outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    };
        return (
            <button 
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}>
            {Icon && <Icon className="w-5 h-5" />}
            {text || children}
            </button>
        )
    }
export default Button;