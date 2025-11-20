// components/common/SpecialtyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
const SpecialtyCard = ({ specialty }) => {
  return (
    <Link 
      to={`/list_doctor_schedule?specialityId=${specialty.specialityId}&name=${encodeURIComponent(specialty.name)}`} 
      className="flex-shrink-0 w-60 border border-gray-300 rounded-xl p-4 shadow-md bg-white"
    >
      <div className="relative h-40 w-full bg-blue-400 rounded-lg mb-3 flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow duration-300">
        <span className="text-white font-bold text-xl">SpecialtyCard</span>
      </div>
      <p className="text-center font-medium text-lg">{specialty.name}</p>
    </Link>
  );
};

export default SpecialtyCard;