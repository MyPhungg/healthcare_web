import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Calendar } from 'lucide-react';
import DoctorCard from '../../components/common/doctorCard';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results = [], searchParams = {} } = location.state || {};

  const { searchQuery, location: searchLocation, specialty } = searchParams;

  const getSearchSummary = () => {
    const parts = [];
    if (searchQuery) parts.push(`"${searchQuery}"`);
    if (searchLocation) parts.push(`tại ${getLocationName(searchLocation)}`);
    if (specialty) parts.push(`chuyên khoa ${specialty}`);
    
    return parts.join(' ');
  };

  const getLocationName = (loc) => {
    const locations = {
      'hanoi': 'Hà Nội',
      'hcm': 'TP. Hồ Chí Minh',
      'danang': 'Đà Nẵng',
      'cantho': 'Cần Thơ',
      'haiphong': 'Hải Phòng'
    };
    return locations[loc] || loc;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 mt-10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Kết quả tìm kiếm
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-600">
            <span>Tìm thấy {results.length} bác sĩ cho:</span>
            <span className="font-semibold text-blue-600">{getSearchSummary()}</span>
          </div>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy bác sĩ phù hợp
            </h3>
            <p className="text-gray-500 mb-6">
              Không có bác sĩ nào phù hợp với tiêu chí tìm kiếm của bạn.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Quay lại trang chủ
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((doctor) => (
              <DoctorCard key={doctor.doctorId} doctor={doctor} />
            ))}
          </div>
        )}

        {/* Search Tips */}
        {results.length === 0 && (
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h4 className="font-semibold text-blue-800 mb-3">Gợi ý tìm kiếm:</h4>
            <ul className="text-blue-700 space-y-2">
              <li>• Thử tìm kiếm với từ khóa khác</li>
              <li>• Kiểm tra lại chính tả</li>
              <li>• Thử tìm kiếm với chuyên khoa cụ thể hơn</li>
              <li>• Mở rộng phạm vi địa điểm tìm kiếm</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;