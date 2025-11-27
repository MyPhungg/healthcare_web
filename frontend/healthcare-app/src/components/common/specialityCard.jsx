import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const SpecialtyCard = ({ specialty }) => {
  // Màu sắc ngẫu nhiên cho background (hoặc có thể map với từng chuyên khoa)
  const getBackgroundColor = (id) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-orange-500 to-orange-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-teal-500 to-teal-600',
      'bg-gradient-to-br from-red-500 to-red-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
    ];
    return colors[id % colors.length];
  };

  // Icon cho từng chuyên khoa (có thể customize thêm)
  const getSpecialtyIcon = (name) => {
    const icons = {
      'Tim mạch': '❤️',
      'Thần kinh': '🧠',
      'Nhi khoa': '👶',
      'Da liễu': '💆',
      'Tai - Mũi - Họng': '👂',
      'Răng - Hàm - Mặt': '🦷',
      'Xương khớp': '🦴',
      'Tiêu hóa': '🍎',
      'Mắt': '👁️',
      'Sản phụ khoa': '🤰',
    };
    return icons[name] || '🏥';
  };

  return (
    <Link 
      to={`/list_doctor_schedule?specialityId=${specialty.specialityId}&name=${encodeURIComponent(specialty.name)}`} 
      className="group flex-shrink-0 w-60 border border-gray-200 rounded-2xl p-4 bg-white shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer"
    >
      {/* Image/Icon Container với hiệu ứng zoom */}
      <div className={`relative h-40 w-full ${getBackgroundColor(specialty.specialityId)} rounded-xl mb-4 flex items-center justify-center overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        {/* Icon chuyên khoa */}
        <div className="relative z-10 text-4xl transform group-hover:scale-110 transition-transform duration-300">
          {getSpecialtyIcon(specialty.name)}
        </div>
        
        {/* Overlay hover effect */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
      </div>
      
      {/* Content */}
      <div className="text-center">
        <p className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
          {specialty.name}
        </p>
        
        {/* Hover arrow indicator */}
        <div className="flex items-center justify-center text-blue-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="text-sm font-medium mr-1">Xem chi tiết</span>
          <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
};

export default SpecialtyCard;