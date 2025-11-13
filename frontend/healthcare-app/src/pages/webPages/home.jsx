import React, {useState, useEffect, use} from 'react';
import HeroSection from '../../components/web/herosection';
import { Outlet } from 'react-router-dom';
import SpecialtyCard from '../../components/common/specialityCard';
import DoctorCard from '../../components/common/doctorCard';
const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctors = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    
    const response = await fetch('http://localhost:8082/api/doctors', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    // KIỂM TRA CONTENT-TYPE TRƯỚC KHI PARSE JSON
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);

    if (!response.ok) {
      // Đọc response text để xem lỗi thực tế
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // CHỈ PARSE JSON NẾU ĐÚNG LÀ JSON
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Doctors data received:', data);
      setDoctors(data);
    } else {
      // Nếu không phải JSON, đọc dạng text để debug
      const textResponse = await response.text();
      console.error('Expected JSON but got:', textResponse);
      throw new Error(`Server returned non-JSON: ${textResponse.substring(0, 200)}`);
    }
  } catch (err) {
    console.error('Error fetching doctors:', err);
    setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
  } finally {
    setLoading(false);
  }
};
  const fetchSpecialties = async () => {
    try{
      //MOCK DATA 
      setSpecialties([
        { id: 1, name: 'Tai - Mũi - Họng', image: '/images/tai-mui-hong.jpg' },
        { id: 2, name: 'Răng - Hàm - Mặt', image: '/images/rang-ham-mat.jpg' },
        { id: 3, name: 'Xương khớp', image: '/images/xuong-khop.jpg' },
        { id: 4, name: 'Tim mạch', image: '/images/tim-mach.jpg' },
        { id: 5, name: 'Thần kinh', image: '/images/than-kinh.jpg' },
        { id: 6, name: 'Da liễu', image: '/images/da-lieu.jpg' },
      ]);
    } catch (err) {
      console.error('Error fetching specialties:', err);
    }
    
  };
  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
  }, []);
  //Hiển thị loading 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  //Hiển thị lỗi
   if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">{error}</p>
          <button 
            onClick={fetchDoctors}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <HeroSection />
      
      {/* Add more sections here */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Chào mừng đến với HealthCareVippro</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Chúng tôi cung cấp dịch vụ y tế chất lượng cao với đội ngũ bác sĩ chuyên nghiệp 
          và trang thiết bị hiện đại.
        </p>
      </div>
      <div className="min-h-screen">
      
      
      <main className="container mx-auto px-4 py-8">
        
        {/* --- Phần 1: Khám chuyên khoa --- */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4  pb-2">Khám chuyên khoa</h2>
          
          <div className="overflow-x-auto"> 
            <div className="flex space-x-6 pb-2">
              {specialties.map(specialty => (
                <SpecialtyCard key={specialty.id} specialty={specialty} />
              ))}
            </div>
          </div>
        </section>

        {/* --- Phần 2: Bác sĩ nổi bật --- */}
        <h2 className="text-2xl font-semibold mb-6 ml-4">Bác sĩ nổi bật</h2>
        <section className="bg-blue-50 py-10 rounded-lg">
          
                   {doctors.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chưa có bác sĩ nào trong hệ thống.</p>
              </div>
            ) : (
              <div className="bg-blue-50 py-10 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
                  {doctors.map(doctor => (
                    <DoctorCard key={doctor.id || doctor.doctorId} doctor={doctor} />
                  ))}
                </div>
              </div>
            )}
        </section>

      </main>
      
    </div>
    </div>
  );
};

export default Home;