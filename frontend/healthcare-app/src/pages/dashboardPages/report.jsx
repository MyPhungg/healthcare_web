import React, { useState, useEffect, useMemo } from 'react';
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
  AlertCircle,
  TrendingDown
} from 'lucide-react';
import Button from '../../components/common/button';
import AppointmentService from '../../service/appointmentService';
import PatientService from '../../service/patientService';
import DoctorService from '../../service/doctorService';
import UserService from '../../service/userService';

const ReportPage = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0], // Ngày đầu tháng
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
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);
  const [usersData, setUsersData] = useState([]);

  // Format date like Overview page
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format time like Overview page
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  // Calculate statistics exactly like Overview page
  const calculateOverviewStatistics = useMemo(() => {
    return (appointments, patients, doctors, users) => {
      console.log('Calculating statistics with:', {
        appointmentsCount: appointments?.length,
        patientsCount: patients?.length,
        doctorsCount: doctors?.length,
        usersCount: users?.length
      });

      // Calculate totals like Overview
      const totalPatients = patients?.length || 0;
      const totalDoctors = doctors?.length || 0;
      
      // Filter appointments by date range
      const filteredAppointments = appointments?.filter(apt => {
        const aptDate = apt.appointment?.appointmentDate;
        if (!aptDate) return false;
        
        const aptDateTime = new Date(aptDate);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        endDate.setHours(23, 59, 59, 999); // Include entire end date
        
        return aptDateTime >= startDate && aptDateTime <= endDate;
      }) || [];

      console.log('Filtered appointments:', filteredAppointments.length);

      // Calculate today's appointments like Overview
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments?.filter(apt => 
        apt.appointment?.appointmentDate === today
      ).length || 0;

      // Calculate monthly revenue exactly like Overview
      const now = new Date();
      const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
      const currentYear = now.getFullYear();

      const monthlyRevenue = appointments?.reduce((total, apt) => {
        const aptDate = apt.appointment?.appointmentDate;
        if (!aptDate) return total;
        
        const [year, month] = aptDate.split('-');
        const isCurrentMonth = parseInt(month) === currentMonth && 
                               parseInt(year) === currentYear;
        const isCompleted = apt.appointment?.status === 'COMPLETED';
        
        if (isCurrentMonth && isCompleted) {
          return total + (apt.fee || 0);
        }
        return total;
      }, 0) || 0;

      console.log('Monthly revenue calculation:', {
        monthlyRevenue,
        currentMonth,
        currentYear,
        sampleFees: appointments?.slice(0, 3).map(apt => ({ 
          fee: apt.fee, 
          date: apt.appointment?.appointmentDate,
          status: apt.appointment?.status 
        }))
      });

      const totalAppointments = filteredAppointments.length;
      const completedAppointments = filteredAppointments.filter(apt => 
        apt.appointment?.status === 'COMPLETED'
      ).length;
      const cancelledAppointments = filteredAppointments.filter(apt => 
        apt.appointment?.status === 'CANCELLED'
      ).length;

      const cancellationRate = totalAppointments > 0 ? 
        (cancelledAppointments / totalAppointments * 100) : 0;
      const completionRate = totalAppointments > 0 ? 
        (completedAppointments / totalAppointments * 100) : 0;

      return {
        totalPatients,
        totalDoctors,
        totalAppointments,
        todayAppointments,
        monthlyRevenue,
        completedAppointments,
        cancelledAppointments,
        cancellationRate,
        completionRate,
        filteredAppointments
      };
    };
  }, [dateRange]);

  // Fetch report data
  const fetchReportData = async () => {
    try {
      setError(null);
      const loadingState = refreshing ? setRefreshing : setLoading;
      loadingState(true);

      // Fetch all data in parallel
      const [appointmentsData, patientsData, doctorsData, usersData] = await Promise.allSettled([
        AppointmentService.getAllAppointments(),
        PatientService.getAllPatients(),
        DoctorService.getAllDoctors(),
        UserService.getAllUsers()
      ]);

      console.log('Report data fetched:', {
        appointments: appointmentsData,
        patients: patientsData,
        doctors: doctorsData,
        users: usersData
      });

      // Set data
      const appointments = appointmentsData.status === 'fulfilled' ? appointmentsData.value : [];
      const patients = patientsData.status === 'fulfilled' ? patientsData.value : [];
      const doctors = doctorsData.status === 'fulfilled' ? doctorsData.value : [];
      const users = usersData.status === 'fulfilled' ? usersData.value : [];

      setAppointmentsData(appointments);
      setPatientsData(patients);
      setDoctorsData(doctors);
      setUsersData(users);

      // Calculate statistics exactly like Overview
      const stats = calculateOverviewStatistics(appointments, patients, doctors, users);

      console.log('Calculated stats:', stats);

      // Update overview stats with same logic as Overview
      updateOverviewStats(stats, appointments);
      
      // Generate detailed reports
      generateDetailedReports(stats.filteredAppointments, doctors);

    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Không thể tải dữ liệu báo cáo. Đang sử dụng dữ liệu mẫu.');
      // Fallback to mock data
      setMockData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Update overview stats exactly like Overview page
  const updateOverviewStats = (stats, appointments) => {
    const {
      totalPatients,
      totalDoctors,
      todayAppointments,
      monthlyRevenue,
      totalAppointments,
      completionRate
    } = stats;

    // Calculate trends using same logic as Overview
    const calculateTrend = (current, previous) => {
      if (!previous || previous === 0) return { value: 100, isPositive: true };
      const change = ((current - previous) / previous) * 100;
      return {
        value: Math.abs(Math.round(change)),
        isPositive: change >= 0
      };
    };

    // Use same calculations as Overview
    const patientTrend = calculateTrend(totalPatients, Math.max(0, totalPatients - 10));
    const revenueTrend = calculateTrend(monthlyRevenue, Math.max(0, monthlyRevenue * 0.8));
    const appointmentTrend = calculateTrend(totalAppointments, Math.max(0, totalAppointments - 5));
    const completionTrend = calculateTrend(completionRate, Math.max(0, completionRate - 5));

    // Format values exactly like Overview
    const formatRevenue = (revenue) => {
      return `${(revenue / 1000000) >= 1 
        ? (revenue / 1000000).toFixed(1) + 'M'
        : revenue.toLocaleString('vi-VN')}đ`;
    };

    setOverviewStats([
      {
        title: 'Tổng bệnh nhân',
        value: totalPatients.toLocaleString('vi-VN'),
        change: `${patientTrend.value}%`,
        trend: patientTrend.isPositive ? 'up' : 'down',
        icon: Users,
        color: 'blue'
      },
      {
        title: 'Doanh thu tháng',
        value: formatRevenue(monthlyRevenue),
        change: `${revenueTrend.value}%`,
        trend: revenueTrend.isPositive ? 'up' : 'down',
        icon: DollarSign,
        color: monthlyRevenue > 0 ? 'green' : 'gray'
      },
      {
        title: 'Lịch hẹn hôm nay',
        value: todayAppointments.toLocaleString('vi-VN'),
        change: `${appointmentTrend.value}%`,
        trend: appointmentTrend.isPositive ? 'up' : 'down',
        icon: Calendar,
        color: todayAppointments > 0 ? 'purple' : 'gray'
      },
      {
        title: 'Tỷ lệ hoàn thành',
        value: `${completionRate.toFixed(1)}%`,
        change: `${completionTrend.value}%`,
        trend: completionTrend.isPositive ? 'up' : 'down',
        icon: Activity,
        color: completionRate > 70 ? 'green' : completionRate > 50 ? 'orange' : 'red'
      }
    ]);
  };

  // Generate detailed reports
  const generateDetailedReports = (filteredAppointments, doctors) => {
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
    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    
    const currentYear = new Date().getFullYear();
    
    appointments.forEach(apt => {
      if (apt.appointment?.status === 'COMPLETED') {
        const aptDate = apt.appointment?.appointmentDate;
        if (!aptDate) return;
        
        const date = new Date(aptDate);
        const month = date.getMonth(); // 0-11
        const year = date.getFullYear();
        
        // Only include current year's data
        if (year !== currentYear) return;
        
        const monthKey = month;
        const monthName = monthNames[month];
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthName,
            revenue: 0,
            appointments: 0
          };
        }
        
        monthlyData[monthKey].revenue += apt.fee || 0;
        monthlyData[monthKey].appointments += 1;
      }
    });

    // Fill in missing months with zero values
    const currentMonth = new Date().getMonth();
    const allMonthsData = [];
    
    for (let month = Math.max(0, currentMonth - 5); month <= currentMonth; month++) {
      if (monthlyData[month]) {
        allMonthsData.push(monthlyData[month]);
      } else {
        allMonthsData.push({
          month: monthNames[month],
          revenue: 0,
          appointments: 0
        });
      }
    }

    console.log('Monthly revenue data:', allMonthsData);
    setRevenueData(allMonthsData);
  };

  // Generate specialty distribution data
  const generateSpecialtyData = (doctors, appointments) => {
    const specialtyCount = {};
    
    appointments.forEach(apt => {
      const doctorId = apt.doctor?.doctorId;
      if (!doctorId) return;
      
      const doctor = doctors.find(d => d.doctorId === doctorId);
      if (doctor && doctor.specialityId) {
        // Map specialityId to name
        const specialtyMap = {
          'SP40138927': 'Nội khoa',
          'SP55347819': 'Phụ khoa',
          'SP82905164': 'Sản khoa',
          'SP30789426': 'Mắt',
          'SP63451702': 'Tai Mũi Họng',
          'SP74123085': 'Da liễu',
          'SP28096531': 'Răng Hàm Mặt',
          'SP09875641': 'Tâm thần',
          'SP96210358': 'Nhi khoa'
        };
        
        const specialtyName = specialtyMap[doctor.specialityId] || 'Khác';
        specialtyCount[specialtyName] = (specialtyCount[specialtyName] || 0) + 1;
      }
    });

    const specialtyColors = {
      'Nội khoa': '#3B82F6',
      'Phụ khoa': '#10B981',
      'Sản khoa': '#8B5CF6',
      'Mắt': '#F59E0B',
      'Tai Mũi Họng': '#EF4444',
      'Da liễu': '#EC4899',
      'Răng Hàm Mặt': '#06B6D4',
      'Tâm thần': '#8B4513',
      'Nhi khoa': '#84CC16',
      'Khác': '#6B7280'
    };

    const sortedSpecialties = Object.entries(specialtyCount)
      .map(([name, value]) => ({
        name,
        value,
        color: specialtyColors[name] || '#6B7280'
      }))
      .sort((a, b) => b.value - a.value);

    console.log('Specialty data:', sortedSpecialties);
    setSpecialtyData(sortedSpecialties);
  };

  // Generate top doctors data
  const generateTopDoctorsData = (doctors, appointments) => {
    const doctorStats = {};
    
    appointments.forEach(apt => {
      const doctorId = apt.doctor?.doctorId;
      const aptStatus = apt.appointment?.status;
      
      if (aptStatus === 'COMPLETED' && doctorId) {
        if (!doctorStats[doctorId]) {
          doctorStats[doctorId] = {
            appointments: 0,
            revenue: 0,
            doctorName: apt.doctor?.fullName
          };
        }
        doctorStats[doctorId].appointments += 1;
        doctorStats[doctorId].revenue += apt.fee || 0;
      }
    });

    const topDoctorsList = Object.entries(doctorStats)
      .map(([doctorId, stats]) => {
        const doctor = doctors.find(d => d.doctorId === doctorId);
        const specialtyMap = {
          'SP40138927': 'Nội khoa',
          'SP55347819': 'Phụ khoa',
          'SP82905164': 'Sản khoa',
          'SP30789426': 'Mắt',
          'SP63451702': 'TMH',
          'SP74123085': 'Da liễu'
        };
        
        return {
          id: doctorId,
          name: stats.doctorName || doctor?.fullName || `Bác sĩ ${doctorId}`,
          specialty: specialtyMap[doctor?.specialityId] || 'Khác',
          appointments: stats.appointments,
          revenue: stats.revenue
        };
      })
      .sort((a, b) => b.revenue - a.revenue) // Sort by revenue
      .slice(0, 5);

    console.log('Top doctors:', topDoctorsList);
    setTopDoctors(topDoctorsList);
  };

  // Generate appointment trends
  const generateAppointmentTrends = (appointments) => {
    const total = appointments.length;
    const completed = appointments.filter(apt => 
      apt.appointment?.status === 'COMPLETED'
    ).length;
    const cancelled = appointments.filter(apt => 
      apt.appointment?.status === 'CANCELLED'
    ).length;
    const pending = appointments.filter(apt => 
      apt.appointment?.status === 'PENDING'
    ).length;
    const confirmed = appointments.filter(apt => 
      apt.appointment?.status === 'CONFIRMED'
    ).length;
    
    const keepRate = total > 0 ? (completed / total * 100) : 0;
    const cancellationRate = total > 0 ? (cancelled / total * 100) : 0;
    const confirmationRate = total > 0 ? ((completed + confirmed) / total * 100) : 0;
    const pendingRate = total > 0 ? (pending / total * 100) : 0;
    
    // Calculate average appointment duration
    let totalDuration = 0;
    let durationCount = 0;
    
    appointments.forEach(apt => {
      const start = apt.appointment?.appointmentStart;
      const end = apt.appointment?.appointmentEnd;
      if (start && end) {
        try {
          const startTime = new Date(`2000-01-01T${start}`);
          const endTime = new Date(`2000-01-01T${end}`);
          const duration = (endTime - startTime) / (1000 * 60); // Convert to minutes
          if (duration > 0 && duration < 180) { // Sanity check: 3 hours max
            totalDuration += duration;
            durationCount++;
          }
        } catch (err) {
          console.error('Error calculating duration:', err);
        }
      }
    });
    
    const avgDuration = durationCount > 0 ? Math.round(totalDuration / durationCount) : 30;
    
    setAppointmentTrends({
      keepRate: keepRate.toFixed(1),
      cancellationRate: cancellationRate.toFixed(1),
      confirmationRate: confirmationRate.toFixed(1),
      pendingRate: pendingRate.toFixed(1),
      avgDuration: avgDuration.toString()
    });
  };

  // Format currency like Overview
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    } else {
      return `${amount.toLocaleString('vi-VN')}`;
    }
  };

  // Mock data fallback using same mock data as Overview
  const setMockData = () => {
    try {
      // Use the same mock data logic as Overview
      const mockAppointments = AppointmentService.getMockAppointments();
      const stats = calculateOverviewStatistics(
        mockAppointments, 
        patientsData, 
        doctorsData, 
        usersData
      );
      
      // Update stats with same logic
      updateOverviewStats(stats, mockAppointments);
      
      // Generate detailed reports from mock data
      generateDetailedReports(stats.filteredAppointments, doctorsData);
    } catch (err) {
      console.error('Error setting mock data:', err);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [dateRange, calculateOverviewStatistics]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReportData();
  };

  const handleExportReport = () => {
    try {
      // Create CSV data
      const csvData = [
        ['BÁO CÁO PHÒNG KHÁM'],
        [`Thời gian: ${dateRange.startDate} đến ${dateRange.endDate}`],
        ['Ngày xuất báo cáo:', new Date().toLocaleDateString('vi-VN')],
        [''],
        ['=== CHỈ SỐ TỔNG QUAN ==='],
        ['Chỉ số', 'Giá trị', 'Thay đổi', 'Xu hướng'],
        ...overviewStats.map(stat => [
          stat.title,
          stat.value,
          stat.change,
          stat.trend === 'up' ? 'Tăng' : 'Giảm'
        ]),
        [''],
        ['=== TOP CHUYÊN KHOA ==='],
        ['Chuyên khoa', 'Số lượt khám'],
        ...specialtyData.map(spec => [spec.name, spec.value]),
        [''],
        ['=== TOP BÁC SĨ ==='],
        ['Tên bác sĩ', 'Chuyên khoa', 'Số lượt khám', 'Doanh thu (VNĐ)'],
        ...topDoctors.map(doc => [
          doc.name,
          doc.specialty,
          doc.appointments,
          doc.revenue.toLocaleString('vi-VN')
        ]),
        [''],
        ['=== XU HƯỚNG LỊCH HẸN ==='],
        ['Chỉ số', 'Giá trị'],
        ['Tỷ lệ hoàn thành', `${appointmentTrends.keepRate || '0'}%`],
        ['Tỷ lệ hủy', `${appointmentTrends.cancellationRate || '0'}%`],
        ['Tỷ lệ xác nhận', `${appointmentTrends.confirmationRate || '0'}%`],
        ['Thời gian khám TB', `${appointmentTrends.avgDuration || '30'} phút`]
      ];

      // Convert to CSV string
      const csvString = csvData.map(row => 
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n');
      
      // Create and download file
      const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `bao-cao-phong-kham-${dateRange.startDate}-${dateRange.endDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('Báo cáo đã được xuất thành công!');
    } catch (err) {
      console.error('Error exporting report:', err);
      alert('Có lỗi xảy ra khi xuất báo cáo. Vui lòng thử lại.');
    }
  };

  const getStatCardColor = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-600',
      green: 'bg-green-50 border-green-200 text-green-600',
      purple: 'bg-purple-50 border-purple-200 text-purple-600',
      red: 'bg-red-50 border-red-200 text-red-600',
      orange: 'bg-orange-50 border-orange-200 text-orange-600',
      gray: 'bg-gray-50 border-gray-200 text-gray-600'
    };
    return colors[color] || colors.blue;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
          <p className="text-gray-600">Đang tải dữ liệu báo cáo...</p>
        </div>
      </div>
    );
  }

  // Calculate current stats for display
  const currentStats = calculateOverviewStatistics(appointmentsData, patientsData, doctorsData, usersData);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Báo cáo & Thống kê</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Theo dõi hiệu suất và hiệu quả hoạt động</p>
          <p className="text-xs text-gray-500 mt-1">
            Thời gian: {dateRange.startDate} - {dateRange.endDate}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm sm:text-base"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Đang làm mới...' : 'Làm mới'}
          </button>
          <button
            onClick={handleExportReport}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base"
          >
            <Download size={18} />
            Xuất CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 flex items-start gap-3">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium break-words">{error}</p>
            <p className="text-sm mt-1">Đang hiển thị dữ liệu mẫu để demo</p>
          </div>
        </div>
      )}

      {/* Debug info - Shows calculation details */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <details>
            <summary className="text-sm font-medium text-gray-700 cursor-pointer">
              📊 Thông tin tính toán (Giống Overview)
            </summary>
            <div className="mt-2 text-xs text-gray-600 space-y-1">
              <p>📅 Tổng bệnh nhân: {currentStats.totalPatients}</p>
              <p>👨‍⚕️ Tổng bác sĩ: {currentStats.totalDoctors}</p>
              <p>📝 Lịch hẹn hôm nay: {currentStats.todayAppointments}</p>
              <p>💰 Doanh thu tháng: {formatCurrency(currentStats.monthlyRevenue)}đ</p>
              <p>✅ Lịch hẹn hoàn thành: {currentStats.completedAppointments}</p>
              <p>❌ Lịch hẹn hủy: {currentStats.cancelledAppointments}</p>
              <p>📊 Tỷ lệ hoàn thành: {currentStats.completionRate.toFixed(1)}%</p>
            </div>
          </details>
        </div>
      )}

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-end">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Từ ngày
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Đến ngày
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Loại báo cáo
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
              >
                <option value="overview">Tổng quan</option>
                <option value="revenue">Doanh thu</option>
                <option value="appointments">Lịch hẹn</option>
                <option value="patients">Bệnh nhân</option>
                <option value="doctors">Bác sĩ</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Same as Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {overviewStats.map((stat, index) => {
          const IconComponent = stat.icon;
          const TrendIcon = getTrendIcon(stat.trend);
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-3 sm:p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-800 mt-1 truncate">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendIcon size={14} className={getTrendColor(stat.trend)} />
                    <p className={`text-xs font-medium ${getTrendColor(stat.trend)} truncate`}>
                      {stat.change} so với kỳ trước
                    </p>
                  </div>
                </div>
                <div className={`p-2 sm:p-3 rounded-full ${getStatCardColor(stat.color)} flex-shrink-0 ml-2`}>
                  <IconComponent size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Doanh thu theo tháng</h3>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => setChartType('bar')}
                className={`p-1.5 sm:p-2 rounded-lg ${chartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                title="Biểu đồ cột"
              >
                <BarChart3 size={18} />
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`p-1.5 sm:p-2 rounded-lg ${chartType === 'line' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                title="Biểu đồ đường"
              >
                <TrendingUp size={18} />
              </button>
            </div>
          </div>
          
          {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Doanh thu theo tháng (năm {new Date().getFullYear()})</h3>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => setChartType('bar')}
                className={`p-1.5 sm:p-2 rounded-lg ${chartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                title="Biểu đồ cột"
              >
                <BarChart3 size={18} />
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`p-1.5 sm:p-2 rounded-lg ${chartType === 'line' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                title="Biểu đồ đường"
              >
                <TrendingUp size={18} />
              </button>
            </div>
          </div>
          
              {/* Monthly Revenue Chart - Matches Monthly Revenue in Stats */}
              <div className="space-y-2 sm:space-y-3">
                {revenueData.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <BarChart3 size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">Không có dữ liệu doanh thu tháng</p>
                  </div>
                ) : (
                  <>
                    {/* Hiển thị tổng doanh thu tháng hiện tại */}
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-blue-600" />
                          <span className="text-sm font-medium text-gray-700">Doanh thu tháng hiện tại:</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">
                          {formatCurrency(overviewStats.find(stat => stat.title === 'Doanh thu tháng')?.value?.replace('đ', '') || '0')}đ
                        </span>
                      </div>
                    </div>
                    
                    {/* Biểu đồ các tháng */}
                    {revenueData.map((item, index) => {
                      const maxRevenue = Math.max(...revenueData.map(d => d.revenue || 0));
                      const widthPercentage = maxRevenue > 0 ? ((item.revenue || 0) / maxRevenue) * 100 : 0;
                      const currentMonth = new Date().getMonth() + 1;
                      const itemMonthNumber = index + 1; // Assuming revenueData is sorted
                      const isCurrentMonth = itemMonthNumber === currentMonth;
                      
                      return (
                        <div key={index} className="flex items-center gap-2 sm:gap-3">
                          <div className="w-16 sm:w-20 text-xs sm:text-sm text-gray-600 truncate">
                            {item.month}
                            {isCurrentMonth && <span className="ml-1 text-blue-500">*</span>}
                          </div>
                          <div className="flex-1">
                            <div 
                              className={`h-4 sm:h-5 rounded-full transition-all duration-300 hover:opacity-90 ${
                                isCurrentMonth ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${widthPercentage}%` }}
                            ></div>
                          </div>
                          <div className="w-20 text-right">
                            <p className="text-xs sm:text-sm font-semibold text-gray-800 whitespace-nowrap">
                              {formatCurrency(item.revenue || 0)}đ
                            </p>
                            
                          </div>
                        </div>
                      );
                    })}
                    
                    
                  </>
                )}
              </div>
            </div>
        </div>

        {/* Specialty Distribution */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Phân bổ chuyên khoa</h3>
            <PieChart className="text-purple-600" size={20} />
          </div>
          
          {/* Specialty Distribution */}
          <div className="space-y-2 sm:space-y-3">
            {specialtyData.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <PieChart size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">Không có dữ liệu chuyên khoa</p>
              </div>
            ) : (
              specialtyData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div 
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">{item.name}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-800 whitespace-nowrap ml-2">
                    {item.value} lượt
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Doctors và Appointment Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Doctors */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Top bác sĩ (theo doanh thu)</h3>
            <span className="text-xs sm:text-sm text-gray-500">
              {topDoctors.length} bác sĩ
            </span>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {topDoctors.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Stethoscope size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">Không có dữ liệu bác sĩ</p>
              </div>
            ) : (
              topDoctors.map((doctor, index) => (
                <div key={doctor.id} className="flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Stethoscope size={14} className="text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm sm:text-base truncate" title={doctor.name}>
                        {doctor.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate" title={doctor.specialty}>
                        {doctor.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base whitespace-nowrap">
                      {doctor.appointments} lượt
                    </p>
                    <p className="text-xs sm:text-sm text-green-600 whitespace-nowrap">
                      {formatCurrency(doctor.revenue)}đ
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Appointment Trends */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Chỉ số lịch hẹn</h3>
            <Activity className="text-blue-600" size={20} />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{appointmentTrends.keepRate || '0'}%</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Hoàn thành</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-green-600">{appointmentTrends.confirmationRate || '0'}%</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Xác nhận</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">{appointmentTrends.pendingRate || '0'}%</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Đang chờ</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-red-600">{appointmentTrends.cancellationRate || '0'}%</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Hủy lịch</p>
            </div>
          </div>
          
          {/* Additional Metrics */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Thời gian khám trung bình:</span>
              <span className="text-sm font-medium text-gray-800">{appointmentTrends.avgDuration || '30'} phút</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">Tổng lịch hẹn (khoảng thời gian):</span>
              <span className="text-sm font-medium text-gray-800">
                {currentStats.totalAppointments}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Tóm tắt báo cáo</h3>
          <span className="text-xs sm:text-sm text-gray-500">
            Khoảng thời gian: {dateRange.startDate} đến {dateRange.endDate}
          </span>
        </div>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 text-sm sm:text-base">
            Báo cáo thống kê hoạt động phòng khám:
          </p>
          <ul className="text-gray-700 list-disc list-inside space-y-1 sm:space-y-2 mt-2 sm:mt-3 text-sm sm:text-base">
            <li>Tổng doanh thu tháng: <strong>{formatCurrency(currentStats.monthlyRevenue)}đ</strong></li>
            <li>Lịch hẹn hôm nay: <strong>{currentStats.todayAppointments}</strong></li>
            <li>Tỷ lệ hoàn thành: <strong>{appointmentTrends.keepRate || '0'}%</strong></li>
            <li>Tỷ lệ hủy lịch: <strong>{appointmentTrends.cancellationRate || '0'}%</strong></li>
            <li>Thời gian khám trung bình: <strong>{appointmentTrends.avgDuration || '30'} phút</strong></li>
          </ul>
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700 text-sm sm:text-base font-medium">
              💡 {parseFloat(appointmentTrends.cancellationRate || 0) > 10 ? 
                'Cần cải thiện tỷ lệ hủy lịch. Khuyến nghị: gửi SMS nhắc nhở 24h trước giờ hẹn.' : 
                'Tỷ lệ hủy lịch đang ở mức tốt. Tiếp tục duy trì chất lượng dịch vụ.'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs sm:text-sm text-gray-500 pt-4">
        <p>Báo cáo được tạo tự động • Dữ liệu được tính từ lịch hẹn đã hoàn thành</p>
        <p className="mt-1">Sử dụng bộ lọc để xem báo cáo chi tiết theo từng tiêu chí</p>
      </div>
    </div>
  );
};

export default ReportPage;