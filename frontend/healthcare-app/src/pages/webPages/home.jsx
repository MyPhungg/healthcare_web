import React, {useState, useEffect} from 'react';
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
      const token = localStorage.getItem('token');
      console.log('🔵 Fetching doctors...');
      
      const response = await fetch('http://localhost:8082/api/doctors', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('Response status:', response.status);
      
      const rawText = await response.text();
      console.log('Raw response length:', rawText.length);

      if (!response.ok) {
        console.error('Error response body:', rawText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Xử lý duplicate response
      let validJson = rawText;
      const firstArrayEnd = rawText.indexOf('][');
      if (firstArrayEnd !== -1) {
        validJson = rawText.substring(0, firstArrayEnd + 1);
        console.warn('⚠️ Detected duplicate response');
      }

      const data = JSON.parse(validJson);
      console.log('✅ Doctors loaded:', data.length);
      setDoctors(data);
      
    } catch (err) {
      console.error('❌ Error fetching doctors:', err);
      setError(err.message || 'Không thể tải danh sách bác sĩ.');
      setDoctors([]); // Set empty array để không crash
    }
  };

  const fetchSpecialties = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🟢 Fetching specialties...');
      
      const response = await fetch('http://localhost:8082/api/specialities', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('Specialties response status:', response.status);
      
      const rawText = await response.text();

      if (!response.ok) {
        console.error('Error response body:', rawText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Xử lý duplicate response (nếu có)
      let validJson = rawText;
      const firstArrayEnd = rawText.indexOf('][');
      if (firstArrayEnd !== -1) {
        validJson = rawText.substring(0, firstArrayEnd + 1);
        console.warn('⚠️ Detected duplicate specialties response');
      }

      const data = JSON.parse(validJson);
      console.log('✅ Specialties loaded:', data.length, data);
      setSpecialties(data);
      
    } catch (err) {
      console.error('❌ Error fetching specialties:', err);
      // Fallback to mock data nếu API lỗi
      console.log('⚠️ Using mock data for specialties');
      setSpecialties([
        { specialityId: 1, name: 'Tai - Mũi - Họng', image: '/images/tai-mui-hong.jpg' },
        { specialityId: 2, name: 'Răng - Hàm - Mặt', image: '/images/rang-ham-mat.jpg' },
        { specialityId: 3, name: 'Xương khớp', image: '/images/xuong-khop.jpg' },
        { specialityId: 4, name: 'Tim mạch', image: '/images/tim-mach.jpg' },
        { specialityId: 5, name: 'Thần kinh', image: '/images/than-kinh.jpg' },
        { specialityId: 6, name: 'Da liễu', image: '/images/da-lieu.jpg' },
      ]);
    }
  };
  useEffect(() => {
    const loadData = async () => {
      console.log('🚀 Starting data load...');
      setLoading(true);
      
      try {
        // ✅ Chạy song song
        await Promise.all([
          fetchDoctors(),
          fetchSpecialties()
        ]);
        console.log('✅ All data loaded');
      } catch (err) {
        console.error('❌ Load failed:', err);
      } finally {
        // ✅ QUAN TRỌNG: Luôn tắt loading
        setLoading(false);
        console.log('✅ Loading complete');
      }
    };

    loadData();
  }, []);

  // Hiển thị loading 
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

  // Hiển thị lỗi (nhưng vẫn cho xem trang)
  return (
    <div>
      <HeroSection />
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                setLoading(true);
                Promise.all([fetchDoctors(), fetchSpecialties()])
                  .finally(() => setLoading(false));
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Chào mừng đến với HealthCareVippro
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Chúng tôi cung cấp dịch vụ y tế chất lượng cao với đội ngũ bác sĩ chuyên nghiệp 
          và trang thiết bị hiện đại.
        </p>
      </div>
      
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          
          {/* Phần 1: Khám chuyên khoa */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 pb-2">Khám chuyên khoa</h2>
            
            <div className="overflow-x-auto"> 
              <div className="flex space-x-6 pb-2">
                {specialties.map(specialty => (
                  <SpecialtyCard key={specialty.id} specialty={specialty} />
                ))}
              </div>
            </div>
          </section>

          {/* Phần 2: Bác sĩ nổi bật */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 ml-4">Bác sĩ nổi bật</h2>
            
            {doctors.length === 0 ? (
              <div className="text-center py-8 bg-blue-50 rounded-lg">
                <p className="text-gray-500">Chưa có bác sĩ nào trong hệ thống.</p>
              </div>
            ) : (
              <div className="bg-blue-50 py-10 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
                  {doctors.map(doctor => (
                    <DoctorCard 
                      key={doctor.id || doctor.doctorId} 
                      doctor={doctor} 
                    />
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