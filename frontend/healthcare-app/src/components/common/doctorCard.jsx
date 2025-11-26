// components/common/DoctorCard.jsx
import React from 'react';
import Button from './button';
import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  
  // Extract doctor information
  const doctorInfo = doctor.doctorDTO || doctor;
  const {
    doctorId,
    fullName = 'BS. Chưa có tên'
  } = doctorInfo;

  // Hàm xử lý khi click Xem chi tiết
  const handleViewDetail = () => {
    if (doctorId) {
      console.log('Navigating to doctor detail:', doctorId);
      navigate(`/doctordetail/${doctorId}`);
    } else {
      console.error('Doctor ID is missing');
      alert('Không thể xem chi tiết bác sĩ. Thiếu thông tin ID.');
    }
  };

  return (
    <div className="flex flex-col items-center p-6 text-center bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
      {/* Vòng tròn Avatar */}
      <div className="w-32 h-32 rounded-full bg-blue-100 mb-4 flex items-center justify-center border-4 border-white shadow-md">
        <span className="text-xl text-blue-600 font-bold">
          {fullName.charAt(0)}
        </span>
      </div>
      
      {/* Tên Bác sĩ */}
      <p className="font-bold text-lg mb-4 text-gray-800 leading-tight">
        {fullName}
      </p>
      
      {/* Nút Xem chi tiết */}
      <Button 
        variant="primary"
        onClick={handleViewDetail}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition duration-200"
      >
        Xem chi tiết
      </Button>
    </div>
  );
};

export default DoctorCard;