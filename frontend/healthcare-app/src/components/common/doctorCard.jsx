// components/common/DoctorCard.jsx
import React from 'react';
import Button from './button'; // Giả định import component Button

const DoctorCard = ({ doctor }) => {
  return (
    <div className="flex flex-col items-center p-4 text-center">
      {/* Vòng tròn Avatar */}
      <div className="w-40 h-40 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
        <span className="text-sm font-semibold">DoctorCard</span>
      </div>
      
      {/* Tên Bác sĩ */}
      <p className="font-bold text-xl mb-3 text-gray-800">{doctor.fullName}</p>
      
      {/* Nút Xem chi tiết */}
      <Button 
        variant="primary" // Cần đảm bảo component Button hỗ trợ variant="primary"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm"
      >
        Xem chi tiết
      </Button>
    </div>
  );
};

export default DoctorCard;