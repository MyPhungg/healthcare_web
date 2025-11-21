import React, {useState, useEffect} from 'react';
import { useSearchParams } from 'react-router-dom';
import DoctorScheduleCard from '../../components/web/doctorScheduleCard'; 

const DoctorScheduleList = () => {
    const [searchParams] = useSearchParams();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [location, setLocation] = useState('all');
    
    const specialityId = searchParams.get('specialityId');
    const specialityName = searchParams.get('name');
    console.log('URL params:', { specialityId, specialityName });
    // SỬA: Fetch data khi component mount hoặc specialityId thay đổi
    useEffect(() => {
        if (specialityId) {
            fetchDoctors(specialityId, selectedDate);
        } else {
            setError('Không tìm thấy thông tin chuyên khoa');
            setLoading(false);
        }
    }, [specialityId]); // Chỉ chạy khi specialityId thay đổi

    // SỬA: Fetch data khi ngày thay đổi
    useEffect(() => {
        if (specialityId) {
            fetchDoctors(specialityId, selectedDate);
        }
    }, [selectedDate]);

    const fetchDoctors = async (specialityId, date) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            // THÊM LOG ĐỂ DEBUG
            console.log('Fetching doctors with:', { specialityId, date });

            const response = await fetch(
                `http://localhost:8081/schedules/speciality?specialityId=${specialityId}&date=${date}`, 
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Doctors data received:', data); // DEBUG
            setDoctors(data);
            setError(null);
                
        } catch (err) {
            console.error('Error fetching doctors:', err);
            setError(err.message || 'Không thể tải danh sách bác sĩ.');
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý đổi ngày - SỬA LỖI LOGIC
    const handleDateChange = (e) => {
        const value = e.target.value;
        let newDate;

        switch(value) {
            case 'today':
                newDate = new Date().toISOString().split('T')[0];
                break;
            case 'tomorrow':
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                newDate = tomorrow.toISOString().split('T')[0];
                break;
            case 'this-week':
                const today = new Date();
                const dayOfWeek = today.getDay();   
                const daysUntilEndOfWeek = 6 - dayOfWeek;
                const endOfWeek = new Date();
                endOfWeek.setDate(today.getDate() + daysUntilEndOfWeek);
                newDate = endOfWeek.toISOString().split('T')[0];
                break;
            default:
                newDate = value; // SỬA: dùng value thay vì selectedDate
        }
        setSelectedDate(newDate);
    };

    // Xử lý khi đổi địa điểm
    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    };

    // Lọc doctor theo location
    const filteredDoctors = location === 'all' 
        ? doctors 
        : doctors.filter(doctor => 
            doctor.city?.toLowerCase().includes(location.toLowerCase())
          );

    // SỬA: Thêm format date function
    const formatVietnameseDate = (dateString) => {
        const date = new Date(dateString);
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        const dayName = days[date.getDay()];
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${dayName} - ${day}-${month}-${year}`;
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 mt-30">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Đang tải danh sách bác sĩ...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 mt-30">
                <div className="flex justify-center items-center h-64">
                    <div className="text-red-500 text-lg">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-30">
            
            {/* Filters */}
            <div className="flex space-x-4 mb-8"> 
                <div className="flex flex-col flex-1">
                    <label htmlFor="location-select" className="text-gray-600 text-sm mb-1 font-medium">
                        Lựa chọn Địa điểm
                    </label>
                    <select
                        id="location-select"
                        value={location}
                        onChange={handleLocationChange}
                        className="p-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none"
                    >
                        <option value="all">Địa điểm (Tất cả)</option>
                        <option value="hồ chí minh">TPHCM</option>
                        <option value="hà nội">Hà Nội</option>
                        <option value="đà nẵng">Đà Nẵng</option>
                        <option value="hải phòng">Hải Phòng</option>
                        <option value="cần thơ">Cần Thơ</option>
                    </select>
                </div>
                
                <div className="flex flex-col flex-1">
                    <label htmlFor="date-select" className="text-gray-600 text-sm mb-1 font-medium">
                        Lựa chọn Ngày
                    </label>
                    <select
                        id="date-select"
                        value={selectedDate} // SỬA: value là selectedDate (YYYY-MM-DD)
                        onChange={handleDateChange}
                        className="p-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none"
                    >
                        <option value={new Date().toISOString().split('T')[0]}>
                            {formatVietnameseDate(new Date())} - Hôm nay
                        </option>
                        <option value={new Date(Date.now() + 86400000).toISOString().split('T')[0]}>
                            {formatVietnameseDate(new Date(Date.now() + 86400000))} - Ngày mai
                        </option>
                        <option value="this-week">
                            Cuối tuần này
                        </option>
                    </select>
                </div>

                {/* Input date cho chọn ngày cụ thể */}
                <div className="flex flex-col flex-1">
                    <label htmlFor="specific-date" className="text-gray-600 text-sm mb-1 font-medium">
                        Chọn ngày cụ thể
                    </label>
                    <input
                        type="date"
                        id="specific-date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="p-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    />
                </div>
            </div>

            {/* Thông tin chuyên khoa */}
            {specialityId && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h2 className="text-xl font-bold text-blue-800">
                       {`Danh sách bác sĩ chuyên khoa ${specialityName}`}
                    </h2>
                    <p className="text-gray-600">Ngày: {formatVietnameseDate(selectedDate)}</p>
                </div>
            )}

            {/* Danh sách Lịch khám */}
            <div className="space-y-6">
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor, index) => (
                        <DoctorScheduleCard 
                            key={doctor.doctorId || index} 
                            doctor={doctor} 
                            selectedDate={selectedDate}
                        />
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        {doctors.length === 0 ? 'Không có bác sĩ nào trong chuyên khoa này.' : 'Không tìm thấy bác sĩ nào phù hợp với bộ lọc.'}
                    </div>
                )}
            </div>
            
            {/* Phân trang */}
            {filteredDoctors.length > 0 && (
                <div className="flex justify-end items-center mt-8">
                    <div className="flex space-x-2 text-gray-600">
                        <button className="p-2 hover:bg-gray-100 rounded-full">&larr;</button>
                        <span className="flex items-center justify-center p-2 w-8 h-8 rounded-full bg-blue-600 text-white font-bold cursor-pointer">1</span>
                        <span className="flex items-center justify-center p-2 w-8 h-8 rounded-full hover:bg-gray-100 cursor-pointer">2</span>
                        <span className="flex items-center justify-center p-2 w-8 h-8 rounded-full hover:bg-gray-100 cursor-pointer">3</span>
                        <button className="p-2 hover:bg-gray-100 rounded-full">&rarr;</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorScheduleList;