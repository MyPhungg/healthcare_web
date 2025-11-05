import React from 'react';
import HeroSection from '../../components/web/herosection';
import { Outlet } from 'react-router-dom';
import SpecialtyCard from '../../components/common/specialityCard';
import DoctorCard from '../../components/common/doctorCard';
const Home = () => {
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
          
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-4">
            {doctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </section>

      </main>
      
    </div>
    </div>
  );
};
const specialties = [
  { id: 1, name: 'Tai - Mũi - Họng', image: 'url_to_image_1' },
  { id: 2, name: 'Răng - Hàm - Mặt', image: 'url_to_image_2' },
  { id: 3, name: 'Xương khớp', image: 'url_to_image_3' },
  // ... thêm chuyên khoa khác
];

const doctors = [
  { id: 1, name: 'Giang Sâm', avatar: 'url_to_avatar_1' },
  { id: 2, name: 'Giang Sâm', avatar: 'url_to_avatar_2' },
  { id: 3, name: 'Giang Sâm', avatar: 'url_to_avatar_3' },
  { id: 4, name: 'Giang Sâm', avatar: 'url_to_avatar_4' },
  // ... thêm bác sĩ khác
];
export default Home;