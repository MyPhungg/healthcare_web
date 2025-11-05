import React from 'react';
import Button from '../common/button'; 
import { MapPin, Calendar, Clock } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
const DoctorScheduleCard = ({ doctor }) => {
    // Dữ liệu giả định
    const { name, title, experience, specialty, description, location, price, date, time } = doctor;
    const navigate = useNavigate();
    return (
        <div className="bg-white p-6 mb-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
            <div className="flex flex-col md:flex-row gap-6">
                
                {/* 1. Phần Thông tin Bác sĩ (Left/Top) */}
                <div className="md:w-1/2 flex gap-4 pr-6 border-r border-gray-200">
                    {/* Avatar */}
                    <div className="w-28 h-28 flex-shrink-0 rounded-full bg-gray-200 overflow-hidden self-start">
                        {/*  */}
                    </div>
                    
                    {/* Chi tiết Bác sĩ */}
                    <div>
                        <h3 className="text-xl font-bold text-blue-600 mb-1">{title}. {name}</h3>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Bác sĩ có {experience} kinh nghiệm trong lĩnh vực **{specialty}**
                        </p>
                        <p className="text-sm text-gray-500 mb-2 italic">
                            Khám: {description}
                        </p>
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPin size={16} className="mr-1 text-red-500" />
                            <span>Địa điểm: {location}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Phần Lịch khám và Đặt lịch (Right/Bottom) */}
                <div className="md:w-1/2  gap-x-4 pl-6">
                    
                    {/* Ngày khám */}
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-700 flex items-center mb-1">
                            <Calendar size={16} className="mr-1 text-teal-500"/>
                            Ngày
                        </span>
                        <div className="py-2 px-3 border border-blue-400 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium text-center">
                            Thứ tư - {date}
                        </div>
                    </div>
                    <br />
                    {/* Giờ khám */}
                    <div className="flex flex-col w-full">
                        <span className="font-semibold text-gray-700 flex items-center mb-1">
                            <Clock size={16} className="mr-1 text-teal-500"/>
                            Giờ
                        </span>
                        
                        {/* CONTAINER MỚI: Dùng grid grid-cols-2 và gap-2 */}
                        <div className="grid grid-cols-4 gap-2"> 
                            
                            {/* Giờ khám 1 */}
                            <div className="py-2 px-3 border border-blue-400 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium text-center cursor-pointer hover:bg-blue-100 transition duration-150">
                                {time}
                            </div>
                            
                            {/* Giờ khám 2 */}
                            <div className="py-2 px-3 border border-blue-400 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium text-center cursor-pointer hover:bg-blue-100 transition duration-150">
                                {time}
                            </div>
                            
                            {/* Giờ khám 3 */}
                            <div className="py-2 px-3 border border-blue-400 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium text-center cursor-pointer hover:bg-blue-100 transition duration-150">
                                {time}
                            </div>
                            
                            {/* Giờ khám 4 */}
                            <div className="py-2 px-3 border border-blue-400 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium text-center cursor-pointer hover:bg-blue-100 transition duration-150">
                                {time}
                            </div> 
                            
                        </div>
                    </div>
                    <br />
                    {/* Địa chỉ phòng khám (lớn hơn) */}
                    <div className="col-span-2">
                        <p className="text-sm text-gray-600 mb-1 font-medium">Địa chỉ chi tiết:</p>
                        <p className="text-base font-medium text-gray-800">{location}</p>
                        <div className="h-px w-full bg-gray-200 mt-2 mb-3"></div> {/* Divider */}
                    </div>
                    
                    {/* Giá khám */}
                    <div className="col-span-2 flex justify-between items-center mt-2">
                        <div className="flex items-center text-lg font-bold text-red-600">
                             Giá khám: {price} VNĐ
                        </div>
                        
                        {/* Nút Đặt lịch */}
                        <Button 
                            variant="primary" 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                            onClick={() => navigate('/booking')}
                        >
                            Đặt lịch ngay
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorScheduleCard;