import React, { useState, useEffect } from 'react';
import { Search, MapPin, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Fetch specialties khi component mount
  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8082/api/specialities', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Specialties data:', data);
        setSpecialties(data);
      } else {
        throw new Error('Failed to fetch specialties');
      }
    } catch (error) {
      console.error('Error fetching specialties:', error);
      setSpecialties([
        { specialityId: 'spec00000001', name: 'Nhi Khoa' },
        { specialityId: 'spec00000002', name: 'Nội tổng quát' },
        { specialityId: 'spec00000003', name: 'Răng Hàm Mặt' },
        { specialityId: 'spec00000004', name: 'Da Liễu' },
        { specialityId: 'spec00000005', name: 'Sản Phụ Khoa' },
      ]);
    }
  };

  // Tìm kiếm suggestions
  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8082/api/doctors', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const doctors = await response.json();
        
        const queryLower = query.toLowerCase();
        const filtered = doctors.filter(doctor => {
          const doctorSpecialty = specialties.find(spec => 
            spec.specialityId === doctor.specialityId
          );
          const specialtyName = doctorSpecialty ? doctorSpecialty.name.toLowerCase() : '';

          return (
            doctor.fullName?.toLowerCase().includes(queryLower) ||
            specialtyName.includes(queryLower) ||
            doctor.clinicName?.toLowerCase().includes(queryLower)
          );
        }).slice(0, 5);

        setSuggestions(filtered);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (doctor) => {
    setSearchQuery(doctor.fullName || '');
    setSuggestions([]);
    navigate(`/doctordetail/${doctor.doctorId}`);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Lấy tất cả doctors trước
      const response = await fetch('http://localhost:8082/api/doctors', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        let doctors = await response.json();
        
        // Filter dữ liệu trên client side
        if (searchQuery.trim()) {
          const queryLower = searchQuery.toLowerCase();
          doctors = doctors.filter(doctor => {
            const doctorSpecialty = specialties.find(spec => 
              spec.specialityId === doctor.specialityId
            );
            const specialtyName = doctorSpecialty ? doctorSpecialty.name.toLowerCase() : '';

            return (
              doctor.fullName?.toLowerCase().includes(queryLower) ||
              specialtyName.includes(queryLower) ||
              doctor.clinicName?.toLowerCase().includes(queryLower)
            );
          });
        }

        // Filter theo chuyên khoa
        if (specialty) {
          doctors = doctors.filter(doctor => doctor.specialityId === specialty);
        }

        // Filter theo location
        if (location) {
          const locationMap = {
            'hanoi': ['Hà Nội', 'Ha Noi', 'hanoi'],
            'hcm': ['Hồ Chí Minh', 'Ho Chi Minh', 'TPHCM', 'TP. Hồ Chí Minh'],
            'danang': ['Đà Nẵng', 'Da Nang'],
            'cantho': ['Cần Thơ', 'Can Tho'],
            'haiphong': ['Hải Phòng', 'Hai Phong']
          };

          const locationKeywords = locationMap[location] || [location];
          doctors = doctors.filter(doctor => {
            const doctorLocation = `${doctor.city} ${doctor.district} ${doctor.address}`.toLowerCase();
            return locationKeywords.some(keyword => 
              doctorLocation.includes(keyword.toLowerCase())
            );
          });
        }

        console.log('Filtered doctors:', doctors);
        
        // Điều hướng đến trang kết quả tìm kiếm
        navigate('/search-results', {
          state: {
            results: doctors,
            searchParams: { 
              searchQuery, 
              location, 
              specialty: specialties.find(spec => spec.specialityId === specialty)?.name || specialty 
            }
          }
        });
      } else {
        throw new Error('Failed to fetch doctors');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = (quickSpecialtyId) => {
    setSpecialty(quickSpecialtyId);
    setSearchQuery('');
    // Tự động tìm kiếm khi chọn quick search
    setTimeout(() => {
      handleSearch(new Event('submit'));
    }, 100);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setLocation('');
    setSpecialty('');
    setSuggestions([]);
  };

  // Lấy tên chuyên khoa để hiển thị trong suggestions
  const getSpecialtyName = (specialityId) => {
    const spec = specialties.find(s => s.specialityId === specialityId);
    return spec ? spec.name : 'Chưa cập nhật';
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 py-16 mt-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
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
          {/* Search Bar với suggestions */}
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-full p-2 mb-4 shadow-lg relative">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm bác sĩ, chuyên khoa, phòng khám..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1 bg-transparent px-6 py-3 outline-none text-gray-800 placeholder-gray-600 text-lg"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search size={24} />
                )}
              </button>
            </div>

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-xl mt-2 z-50 max-h-60 overflow-y-auto">
                {suggestions.map((doctor) => (
                  <div
                    key={doctor.doctorId}
                    onClick={() => handleSuggestionClick(doctor)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Stethoscope size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{doctor.fullName}</p>
                        <p className="text-sm text-gray-600">
                          {getSpecialtyName(doctor.specialityId)} • {doctor.clinicName}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter Options */}
          <div className="flex flex-col lg:flex-row gap-4 justify-center items-center">
            {/* Location Select */}
            <div className="relative flex-1 max-w-xs">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-700 font-medium outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer appearance-none transition-all duration-200"
              >
                <option value="">Tất cả địa điểm</option>
                <option value="hanoi">Hà Nội</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
                <option value="danang">Đà Nẵng</option>
                <option value="cantho">Cần Thơ</option>
                <option value="haiphong">Hải Phòng</option>
              </select>
            </div>

            {/* Specialty Select */}
            <div className="relative flex-1 max-w-xs">
              <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-700 font-medium outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer appearance-none transition-all duration-200"
              >
                <option value="">Tất cả chuyên khoa</option>
                {specialties.map((spec) => (
                  <option key={spec.specialityId} value={spec.specialityId}>
                    {spec.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang tìm...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Tìm bác sĩ
                  </>
                )}
              </button>
              
              {(searchQuery || location || specialty) && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
        </form>

      
        {/* Search Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-white opacity-90">
          <div>
            <div className="text-2xl font-bold">100+</div>
            <div className="text-sm">Bác sĩ chuyên khoa</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{specialties.length}+</div>
            <div className="text-sm">Chuyên khoa</div>
          </div>
          <div>
            <div className="text-2xl font-bold">10.000+</div>
            <div className="text-sm">Bệnh nhân hài lòng</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;