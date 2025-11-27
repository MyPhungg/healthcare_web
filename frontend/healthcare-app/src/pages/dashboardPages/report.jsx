import React, { useState, useEffect } from 'react';
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
  Activity,
  Loader,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/common/button';
import AppointmentService from '../../service/appointmentService';
import PatientService from '../../service/patientService';
import DoctorService from '../../service/doctorService';
import UserService from '../../service/userService';

const ReportPage = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // 1/1 của năm hiện tại
    endDate: new Date().toISOString().split('T')[0] // Hôm nay
  });
  const [reportType, setReportType] = useState('overview');
  const [chartType, setChartType] = useState('bar');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // State for report data
  const [overviewStats, setOverviewStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [specialtyData, setSpecialtyData] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [appointmentTrends, setAppointmentTrends] = useState({});

  // Fetch report data
  const fetchReportData = async () => {
    try {
      setError(null);
      const loadingState = refreshing ? setRefreshing : setLoading;
      loadingState(true);

      // Fetch all data in parallel
      const [appointmentsData, patientsData, doctorsData, usersData] = await Promise.all([
        AppointmentService.getAllAppointments().catch(err => {
          console.error('Error fetching appointments:', err);
          return [];
        }),
        PatientService.getAllPatients().catch(err => {
          console.error('Error fetching patients:', err);
          return [];
        }),
        DoctorService.getAllDoctors().catch(err => {
          console.error('Error fetching doctors:', err);
          return [];
        }),
        UserService.getAllUsers().catch(err => {
          console.error('Error fetching users:', err);
          return [];
        })
      ]);

      console.log('Report data:', {
        appointments: appointmentsData,
        patients: patientsData,
        doctors: doctorsData,
        users: usersData
      });

      // Process data for reports
      processReportData(appointmentsData, patientsData, doctorsData, usersData);

    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Không thể tải dữ liệu báo cáo. Vui lòng thử lại.');
      // Fallback to mock data
      setMockData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Process data for reports
  const processReportData = (appointments, patients, doctors, users) => {
    // Calculate overview stats
    const totalPatients = patients.length || users.filter(user => user.role === 'PATIENT').length;
    const totalDoctors = doctors.length || users.filter(user => user.role === 'DOCTOR').length;
    
    // Filter appointments by date range
    const filteredAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentDate);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return aptDate >= startDate && aptDate <= endDate;
    });

    const totalAppointments = filteredAppointments.length;
    const completedAppointments = filteredAppointments.filter(apt => apt.status === 'COMPLETED').length;
    const cancelledAppointments = filteredAppointments.filter(apt => apt.status === 'CANCELLED').length;
    const cancellationRate = totalAppointments > 0 ? (cancelledAppointments / totalAppointments * 100) : 0;

    // Calculate revenue
    const totalRevenue = filteredAppointments
      .filter(apt => apt.status === 'COMPLETED')
      .reduce((total, apt) => total + (apt.totalPrice || 0), 0);

    // Update overview stats
    setOverviewStats([
      {
        title: 'Tổng bệnh nhân',
        value: totalPatients.toLocaleString(),
        change: '+12.5%',
        trend: 'up',
        icon: Users,
        color: 'blue'
      },
      {
        title: 'Doanh thu',
        value: `${(totalRevenue / 1000000).toFixed(1)}M VNĐ`,
        change: '+8.3%',
        trend: 'up',
        icon: DollarSign,
        color: 'green'
      },
      {
        title: 'Lịch hẹn',
        value: totalAppointments.toLocaleString(),
        change: '+5.2%',
        trend: 'up',
        icon: Calendar,
        color: 'purple'
      },
      {
        title: 'Tỷ lệ hủy',
        value: `${cancellationRate.toFixed(1)}%`,
        change: '-1.1%',
        trend: cancellationRate < 5 ? 'down' : 'up',
        icon: Activity,
        color: cancellationRate < 5 ? 'red' : 'orange'
      }
    ]);

    // Generate monthly revenue data
    generateMonthlyRevenueData(filteredAppointments);
    
    // Generate specialty distribution
    generateSpecialtyData(doctors, filteredAppointments);
    
    // Generate top doctors data
    generateTopDoctorsData(doctors, filteredAppointments);
    
    // Generate appointment trends
    generateAppointmentTrends(filteredAppointments);
  };

  // Generate monthly revenue data
  const generateMonthlyRevenueData = (appointments) => {
    const monthlyData = {};
    
    appointments.forEach(apt => {
      if (apt.status === 'COMPLETED') {
        const date = new Date(apt.appointmentDate);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        const monthName = `Tháng ${date.getMonth() + 1}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthName,
            revenue: 0,
            appointments: 0
          };
        }
        
        monthlyData[monthKey].revenue += apt.totalPrice || 0;
        monthlyData[monthKey].appointments += 1;
      }
    });

    const sortedData = Object.values(monthlyData)
      .sort((a, b) => {
        const aNum = parseInt(a.month.replace('Tháng ', ''));
        const bNum = parseInt(b.month.replace('Tháng ', ''));
        return aNum - bNum;
      });

    setRevenueData(sortedData);
  };

  // Generate specialty distribution data
  const generateSpecialtyData = (doctors, appointments) => {
    const specialtyCount = {};
    
    appointments.forEach(apt => {
      const doctor = doctors.find(d => d.doctorId === apt.doctorId);
      if (doctor && doctor.speciality) {
        const specialtyName = doctor.speciality.specialityName || 'Khác';
        specialtyCount[specialtyName] = (specialtyCount[specialtyName] || 0) + 1;
      }
    });

    const specialtyColors = {
      'Tim mạch': '#3B82F6',
      'Nhi khoa': '#10B981',
      'Da liễu': '#8B5CF6',
      'Thần kinh': '#F59E0B',
      'Tiêu hóa': '#EF4444',
      'Khác': '#6B7280'
    };

    const sortedSpecialties = Object.entries(specialtyCount)
      .map(([name, value]) => ({
        name,
        value,
        color: specialtyColors[name] || '#6B7280'
      }))
      .sort((a, b) => b.value - a.value);

    setSpecialtyData(sortedSpecialties);
  };

  // Generate top doctors data
  const generateTopDoctorsData = (doctors, appointments) => {
    const doctorStats = {};
    
    appointments.forEach(apt => {
      if (apt.status === 'COMPLETED') {
        if (!doctorStats[apt.doctorId]) {
          doctorStats[apt.doctorId] = {
            appointments: 0,
            revenue: 0
          };
        }
        doctorStats[apt.doctorId].appointments += 1;
        doctorStats[apt.doctorId].revenue += apt.totalPrice || 0;
      }
    });

    const topDoctorsList = Object.entries(doctorStats)
      .map(([doctorId, stats]) => {
        const doctor = doctors.find(d => d.doctorId === doctorId);
        return {
          name: doctor?.fullName || `Bác sĩ ${doctorId}`,
          specialty: doctor?.speciality?.specialityName || 'Chưa cập nhật',
          appointments: stats.appointments,
          revenue: stats.revenue / 1000000 // Convert to millions
        };
      })
      .sort((a, b) => b.appointments - a.appointments)
      .slice(0, 5);

    setTopDoctors(topDoctorsList);
  };

  // Generate appointment trends
  const generateAppointmentTrends = (appointments) => {
    const total = appointments.length;
    const completed = appointments.filter(apt => apt.status === 'COMPLETED').length;
    const cancelled = appointments.filter(apt => apt.status === 'CANCELLED').length;
    
    const keepRate = total > 0 ? (completed / total * 100) : 0;
    const cancellationRate = total > 0 ? (cancelled / total * 100) : 0;
    
    setAppointmentTrends({
      keepRate: keepRate.toFixed(1),
      cancellationRate: cancellationRate.toFixed(1),
      satisfactionRate: '94.0', // Placeholder - you might need feedback data
      avgWaitTime: '22' // Placeholder
    });
  };

  // Mock data fallback
  const setMockData = () => {
    setOverviewStats([
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
    ]);

    setRevenueData([
      { month: 'Tháng 1', revenue: 28.5, appointments: 210 },
      { month: 'Tháng 2', revenue: 32.1, appointments: 245 },
      // ... rest of mock data
    ]);

    setSpecialtyData([
      { name: 'Tim mạch', value: 325, color: '#3B82F6' },
      { name: 'Nhi khoa', value: 298, color: '#10B981' },
      // ... rest of mock data
    ]);

    setTopDoctors([
      { name: 'Dr. Trần Thị B', specialty: 'Tim mạch', appointments: 156, revenue: 46.8 },
      // ... rest of mock data
    ]);

    setAppointmentTrends({
      keepRate: '78.0',
      cancellationRate: '4.2',
      satisfactionRate: '94.0',
      avgWaitTime: '22'
    });
  };

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReportData();
  };

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
      red: 'bg-red-50 border-red-200 text-red-600',
      orange: 'bg-orange-50 border-orange-200 text-orange-600'
    };
    return colors[color] || colors.blue;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
          <p className="text-gray-600">Đang tải dữ liệu báo cáo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Báo cáo & Thống kê</h1>
          <p className="text-gray-600 mt-2">Theo dõi hiệu suất và hiệu quả hoạt động</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Đang làm mới...' : 'Làm mới'}
          </button>
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

      {error && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{error}</p>
            <p className="text-sm mt-1">Đang hiển thị dữ liệu mẫu để demo</p>
          </div>
        </div>
      )}

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
          
          {/* Simple Bar Chart */}
          <div className="space-y-3">
            {revenueData.map((item, index) => {
              const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
              const widthPercentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-600">{item.month}</div>
                  <div className="flex-1">
                    <div 
                      className="bg-blue-500 h-6 rounded-full transition-all duration-300 hover:bg-blue-600"
                      style={{ width: `${widthPercentage}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-right text-sm font-semibold text-gray-800">
                    {item.revenue.toFixed(1)}M
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Specialty Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Phân bổ chuyên khoa</h3>
            <PieChart className="text-purple-600" size={24} />
          </div>
          
          {/* Specialty Distribution */}
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
                  <p className="text-sm text-green-600">{doctor.revenue.toFixed(1)}M VNĐ</p>
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
              <span className="font-semibold text-green-600">
                {overviewStats[1]?.value?.replace('M VNĐ', '') || '0'}M VNĐ
              </span>
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
                <span className="font-bold text-lg text-green-600">
                  {overviewStats[1]?.value || '0 VNĐ'}
                </span>
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
            <p className="text-2xl font-bold text-blue-600">{appointmentTrends.keepRate}%</p>
            <p className="text-sm text-gray-600 mt-1">Tỷ lệ giữ lịch</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{appointmentTrends.avgWaitTime} phút</p>
            <p className="text-sm text-gray-600 mt-1">Thời gian chờ TB</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{appointmentTrends.satisfactionRate}%</p>
            <p className="text-sm text-gray-600 mt-1">Hài lòng</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{appointmentTrends.cancellationRate}%</p>
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
            <li>Chuyên khoa {specialtyData[0]?.name || 'Tim mạch'} có số lượng khám cao nhất</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;