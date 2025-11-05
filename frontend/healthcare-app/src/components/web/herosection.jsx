import React, { useState } from 'react';
import { Search } from 'lucide-react';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log({ searchQuery, location, specialty });
    // TODO: Implement search logic
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 py-16 mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center text-white mb-8">
          <h1 className="text-5xl font-bold mb-4">Xin chào!</h1>
          <h2 className="text-4xl font-bold mb-2">
            Đây là HealthcareVippro,
          </h2>
          <p className="text-3xl font-light">
            Nơi sức khỏe của bạn sẽ luôn được tôn trọng.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-full p-2 mb-4 shadow-lg">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent px-6 py-3 outline-none text-gray-800 placeholder-gray-600 text-lg"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 transition-colors"
              >
                <Search size={24} />
              </button>
            </div>
          </div>

          {/* Filter Options */}
          <div className="flex gap-4 justify-center items-center">
            {/* Location Select */}
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-6 py-3 rounded-lg bg-white text-gray-700 font-medium outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer min-w-[150px]"
            >
              <option value="">Vị trí</option>
              <option value="hanoi">Hà Nội</option>
              <option value="hcm">TP. Hồ Chí Minh</option>
              <option value="danang">Đà Nẵng</option>
              <option value="cantho">Cần Thơ</option>
            </select>

            {/* Specialty Select */}
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="px-6 py-3 rounded-lg bg-white text-gray-700 font-medium outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer min-w-[180px]"
            >
              <option value="">Chuyên khoa</option>
              <option value="cardiology">Tim mạch</option>
              <option value="neurology">Thần kinh</option>
              <option value="orthopedics">Chấn thương chỉnh hình</option>
              <option value="pediatrics">Nhi khoa</option>
              <option value="dermatology">Da liễu</option>
            </select>

            {/* Search Button */}
            <button
              type="submit"
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all shadow-md"
            >
              Tìm bác sĩ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroSection;