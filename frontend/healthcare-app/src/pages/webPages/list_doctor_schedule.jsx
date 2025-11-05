
import React from 'react';
import DoctorScheduleCard from '../../components/web/doctorScheduleCard'; 



const mockDoctors = [
    {
        name: 'Diệu Lâm', title: 'BS.TS', experience: '10 năm', specialty: 'Tai mũi họng', 
        description: 'Khám đầu sốt đó, chọt đầu nghẹt đó', location: 'Thiên Văn Tinh', 
        price: '3000', date: '8/10', time: '9:00 - 10:00'
    },

    {
        name: 'Diệu Lâm', title: 'BS.TS', experience: '10 năm', specialty: 'Tai mũi họng', 
        description: 'Khám đầu sốt đó, chọt đầu nghẹt đó', location: 'Thiên Văn Tinh', 
        price: '3000', date: '8/10', time: '9:00 - 10:00'
    },
];

const DoctorScheduleList = () => {
    return (
        <div className="container mx-auto px-4 py-8 mt-30">
            
            <div className="flex space-x-4 mb-8"> 
                <div className="flex flex-col flex-1">
                    <label htmlFor="location-select" className="text-gray-600 text-sm mb-1 font-medium">Lựa chọn Địa điểm</label>
                    <select
                        id="location-select"
                        value=""
                        className="p-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none"
                    >
                        <option value="all">Địa điểm (Tất cả)</option>
                        <option value="hcm">TPHCM</option>
                        <option value="hn">Hà Nội</option>
                        {/* Thêm các địa điểm khác */}
                    </select>
                </div>
                <div className="flex flex-col flex-1">
                    <label htmlFor="date-select" className="text-gray-600 text-sm mb-1 font-medium">Lựa chọn Ngày</label>
                    <select
                        id="date-select"
                        value=""
                        className="p-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none"
                    >
                        <option value="today">Chọn ngày (Hôm nay)</option>
                        <option value="tomorrow">Ngày mai</option>
                        <option value="this-week">Tuần này</option>
                    </select>
                </div>
            </div>

            {/* Danh sách Lịch khám */}
            <div className="space-y-6">
                {mockDoctors.map((doctor, index) => (
                    <DoctorScheduleCard key={index} doctor={doctor} />
                ))}
            </div>
            
            {/* Phân trang (Pagination) */}
            <div className="flex justify-end items-center mt-8">
                {/*  */}
                <div className="flex space-x-2 text-gray-600">
                    {/* Biểu tượng mũi tên trái */}
                    <button className="p-2 hover:bg-gray-100 rounded-full">&larr;</button>
                    <span className="flex items-center justify-center p-2 w-8 h-8 rounded-full bg-blue-600 text-white font-bold cursor-pointer">1</span>
                    <span className="flex items-center justify-center p-2 w-8 h-8 rounded-full hover:bg-gray-100 cursor-pointer">2</span>
                    <span className="flex items-center justify-center p-2 w-8 h-8 rounded-full hover:bg-gray-100 cursor-pointer">3</span>
                    {/* Biểu tượng mũi tên phải */}
                    <button className="p-2 hover:bg-gray-100 rounded-full">&rarr;</button>
                </div>
            </div>

        </div>
    );
};

export default DoctorScheduleList;