import React, { useState } from 'react';
import { 
  Calendar, 
  Download, 
  Filter, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock,
  Stethoscope,
  Activity
} from 'lucide-react';
import Button from '../../components/common/button';

const ReportPage = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '2025-01-01',
    endDate: '2025-11-30'
  });
  const [reportType, setReportType] = useState('overview');
  const [chartType, setChartType] = useState('bar');

  // Dữ liệu thống kê tổng quan
  const overviewStats = [
    {
      title: 'Tổng bệnh nhân',
      value: '1,245',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Doanh thu',
      value: '356,8M VNĐ',
      change: '+8.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Lịch hẹn',
      value: '2,867',
      change: '+5.2%',
      trend: 'up',
      icon: Calendar,
      color: 'purple'
    },
    {
      title: 'Tỷ lệ hủy',
      value: '4.2%',
      change: '-1.1%',
      trend: 'down',
      icon: Activity,
      color: 'red'
    }
  ];

  // Dữ liệu doanh thu theo tháng
  const revenueData = [
    { month: 'Tháng 1', revenue: 28.5, appointments: 210 },
    { month: 'Tháng 2', revenue: 32.1, appointments: 245 },
    { month: 'Tháng 3', revenue: 29.8, appointments: 225 },
    { month: 'Tháng 4', revenue: 35.2, appointments: 268 },
    { month: 'Tháng 5', revenue: 38.9, appointments: 295 },
    { month: 'Tháng 6', revenue: 42.3, appointments: 320 },
    { month: 'Tháng 7', revenue: 45.1, appointments: 342 },
    { month: 'Tháng 8', revenue: 48.7, appointments: 368 },
    { month: 'Tháng 9', revenue: 52.4, appointments: 398 },
    { month: 'Tháng 10', revenue: 55.8, appointments: 425 },
    { month: 'Tháng 11', revenue: 58.2, appointments: 445 },
  ];

  // Dữ liệu chuyên khoa phổ biến
  const specialtyData = [
    { name: 'Tim mạch', value: 325, color: '#3B82F6' },
    { name: 'Nhi khoa', value: 298, color: '#10B981' },
    { name: 'Da liễu', value: 267, color: '#8B5CF6' },
    { name: 'Thần kinh', value: 234, color: '#F59E0B' },
    { name: 'Tiêu hóa', value: 198, color: '#EF4444' },
    { name: 'Khác', value: 345, color: '#6B7280' }
  ];

  // Dữ liệu bác sĩ hàng đầu
  const topDoctors = [
    { name: 'Dr. Trần Thị B', specialty: 'Tim mạch', appointments: 156, revenue: 46.8 },
    { name: 'Dr. Phạm Văn D', specialty: 'Nhi khoa', appointments: 142, revenue: 28.4 },
    { name: 'Dr. Nguyễn F', specialty: 'Da liễu', appointments: 128, revenue: 32.0 },
    { name: 'Dr. Lê H', specialty: 'Thần kinh', appointments: 115, revenue: 46.0 },
    { name: 'Dr. Vũ Thị K', specialty: 'Tiêu hóa', appointments: 98, revenue: 24.5 }
  ];

  const handleExportReport = () => {
    // Logic export report
    console.log('Exporting report...');
    alert('Báo cáo đang được xuất...');
  };

  const getStatCardColor = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-600',
      green: 'bg-green-50 border-green-200 text-green-600',
      purple: 'bg-purple-50 border-purple-200 text-purple-600',
      red: 'bg-red-50 border-red-200 text-red-600'
    };
    return colors[color] || colors.blue;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Báo cáo & Thống kê</h1>
          <p className="text-gray-600 mt-2">Theo dõi hiệu suất và hiệu quả hoạt động</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportReport}>
            <Download size={20} className="mr-2" />
            Xuất báo cáo
          </Button>
          <Button variant="primary">
            <Filter size={20} className="mr-2" />
            Bộ lọc nâng cao
          </Button>
        </div>
      </div>

      {/* Date Range và Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Từ ngày
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đến ngày
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại báo cáo
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="overview">Tổng quan</option>
                <option value="revenue">Doanh thu</option>
                <option value="appointments">Lịch hẹn</option>
                <option value="patients">Bệnh nhân</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  <p className={`text-sm font-medium mt-1 ${getTrendColor(stat.trend)}`}>
                    {stat.change} so với tháng trước
                  </p>
                </div>
                <div className={`p-3 rounded-full ${getStatCardColor(stat.color)}`}>
                  <IconComponent size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Doanh thu theo tháng</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('bar')}
                className={`p-2 rounded-lg ${chartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <BarChart3 size={20} />
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`p-2 rounded-lg ${chartType === 'line' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <TrendingUp size={20} />
              </button>
            </div>
          </div>
          
          {/* Simple Bar Chart (thay thế bằng chart library thực tế) */}
          <div className="space-y-3">
            {revenueData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600">{item.month}</div>
                <div className="flex-1">
                  <div 
                    className="bg-blue-500 h-6 rounded-full transition-all duration-300 hover:bg-blue-600"
                    style={{ width: `${(item.revenue / 60) * 100}%` }}
                  ></div>
                </div>
                <div className="w-20 text-right text-sm font-semibold text-gray-800">
                  {item.revenue}M
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specialty Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Phân bổ chuyên khoa</h3>
            <PieChart className="text-purple-600" size={24} />
          </div>
          
          {/* Simple Pie Chart Representation */}
          <div className="space-y-3">
            {specialtyData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="text-sm font-semibold text-gray-800">{item.value} lượt</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Doctors và Chi tiết doanh thu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Doctors */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Bác sĩ hàng đầu</h3>
          <div className="space-y-4">
            {topDoctors.map((doctor, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Stethoscope size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{doctor.name}</p>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{doctor.appointments} lượt</p>
                  <p className="text-sm text-green-600">{doctor.revenue}M VNĐ</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Details */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Chi tiết doanh thu</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="text-green-600" size={20} />
                <span className="font-medium text-gray-700">Doanh thu khám bệnh</span>
              </div>
              <span className="font-semibold text-green-600">285.4M VNĐ</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="text-blue-600" size={20} />
                <span className="font-medium text-gray-700">Dịch vụ thêm</span>
              </div>
              <span className="font-semibold text-blue-600">71.4M VNĐ</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="text-purple-600" size={20} />
                <span className="font-medium text-gray-700">Chi phí hoạt động</span>
              </div>
              <span className="font-semibold text-purple-600">-89.2M VNĐ</span>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-gray-800">Tổng doanh thu</span>
                <span className="font-bold text-lg text-green-600">356.8M VNĐ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Trends */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Xu hướng lịch hẹn</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">78%</p>
            <p className="text-sm text-gray-600 mt-1">Tỷ lệ giữ lịch</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">22 phút</p>
            <p className="text-sm text-gray-600 mt-1">Thời gian chờ TB</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">94%</p>
            <p className="text-sm text-gray-600 mt-1">Hài lòng</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">4.2%</p>
            <p className="text-sm text-gray-600 mt-1">Tỷ lệ hủy</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tóm tắt báo cáo</h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700">
            Trong khoảng thời gian từ {dateRange.startDate} đến {dateRange.endDate}, phòng khám đã đạt được:
          </p>
          <ul className="text-gray-700 list-disc list-inside space-y-2 mt-3">
            <li>Tăng trưởng doanh thu 8.3% so với cùng kỳ</li>
            <li>Tiếp nhận thêm 138 bệnh nhân mới</li>
            <li>Giảm tỷ lệ hủy lịch hẹn 1.1%</li>
            <li>Chuyên khoa Tim mạch và Nhi khoa có số lượng khám cao nhất</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;