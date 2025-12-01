import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Plus, Trash2, Edit3, Save, DollarSign, X, Users } from 'lucide-react';
import Button from '../../components/common/button';
import ScheduleService from '../../service/scheduleService';
import AuthService from '../../service/authService';

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState(null);

  const [formData, setFormData] = useState({
    workingDays: [],
    startTime: '08:00',
    endTime: '17:00',
    consultationFee: '',
    slotDuration: 30,
  });

  const daysOfWeek = [
    { value: 'MON', label: 'Thứ 2' },
    { value: 'TUE', label: 'Thứ 3' },
    { value: 'WED', label: 'Thứ 4' },
    { value: 'THU', label: 'Thứ 5' },
    { value: 'FRI', label: 'Thứ 6' },
    { value: 'SAT', label: 'Thứ 7' },
    { value: 'SUN', label: 'Chủ nhật' },
  ];

  const slotDurations = [
    { value: 15, label: '15 phút' },
    { value: 20, label: '20 phút' },
    { value: 30, label: '30 phút' },
    { value: 45, label: '45 phút' },
    { value: 60, label: '60 phút' },
  ];

  // Fetch schedules from API
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const doctorId = await getDoctorId();
        if (doctorId) {
          const scheduleData = await ScheduleService.getDoctorSchedule(doctorId);
          if (scheduleData) {
            setSchedules([scheduleData]);
          } else {
            setSchedules([]); // No schedule found
          }
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
        // Nếu lỗi 404 hoặc không tìm thấy, set schedules rỗng
        if (error.message.includes('404') || error.message.includes('not found')) {
          setSchedules([]);
        } else {
          alert('Lỗi khi tải lịch làm việc: ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const getDoctorId = async () => {
    try {
      const userId = AuthService.getUserId();
      const doctorProfile = await ScheduleService.getDoctorProfile(userId);
      const doctorId = doctorProfile.doctorId;
      setDoctorId(doctorId);
      return doctorId;
    } catch (error) {
      console.error('Error getting doctor ID:', error);
      alert('Không thể lấy thông tin bác sĩ: ' + error.message);
      return null;
    }
  };

  const handleDayChange = (day) => {
    setFormData((prev) => {
      const updatedDays = prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day];
      return { ...prev, workingDays: updatedDays };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.workingDays.length === 0) {
      alert('Vui lòng chọn ít nhất một ngày làm việc');
      return;
    }
    if (!formData.consultationFee) {
      alert('Vui lòng nhập phí tư vấn');
      return;
    }

    try {
      if (!doctorId) {
        alert('Không tìm thấy thông tin bác sĩ');
        return;
      }

      const schedulePayload = {
        doctorId: doctorId,
        workingDays: formData.workingDays.join(','),
        startTime: formData.startTime + ':00', // Thêm seconds cho format HH:mm:ss
        endTime: formData.endTime + ':00', // Thêm seconds cho format HH:mm:ss
        consultationFee: parseFloat(formData.consultationFee),
        slotDuration: formData.slotDuration
      };

      console.log('Sending schedule data:', schedulePayload);

      if (isEditing) {
        // Update schedule
        await ScheduleService.updateSchedule(editId, schedulePayload);
        alert('Cập nhật lịch thành công!');
      } else {
        // Create new schedule
        await ScheduleService.createSchedule(schedulePayload);
        alert('Tạo lịch làm việc thành công!');
      }

      // Refresh data
      const scheduleData = await ScheduleService.getDoctorSchedule(doctorId);
      if (scheduleData) {
        setSchedules([scheduleData]);
      } else {
        setSchedules([]);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Lỗi khi lưu lịch làm việc: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa lịch này không?')) {
      try {
        await ScheduleService.deleteSchedule(id);
        setSchedules([]);
        alert('Xóa lịch thành công!');
      } catch (error) {
        console.error('Error deleting schedule:', error);
        alert('Lỗi khi xóa lịch: ' + error.message);
      }
    }
  };

  const handleEdit = (schedule) => {
    setFormData({
      workingDays: schedule.workingDays.split(','),
      startTime: schedule.startTime.substring(0, 5), // Remove seconds
      endTime: schedule.endTime.substring(0, 5), // Remove seconds
      consultationFee: schedule.consultationFee.toString(),
      slotDuration: schedule.slotDuration,
    });
    setIsEditing(true);
    setEditId(schedule.scheduleId);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setFormData({
      workingDays: [],
      startTime: '08:00',
      endTime: '17:00',
      consultationFee: '',
      slotDuration: 30,
    });
  };

  const formatDays = (daysString) => {
    const daysArray = daysString.split(',');
    return daysArray
      .map((day) => {
        const found = daysOfWeek.find((d) => d.value === day);
        return found ? found.label : day;
      })
      .join(', ');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  const getAppointmentStats = (schedule) => {
    if (!schedule.appointments) return { total: 0, pending: 0, confirmed: 0, cancelled: 0 };
    
    const appointments = schedule.appointments;
    return {
      total: appointments.length,
      pending: appointments.filter(a => a.status === 'PENDING').length,
      confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
      complete: appointments.filter(a => a.status === 'COMPLETED').length,
      cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải lịch làm việc...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Lịch làm việc</h1>
          <p className="text-gray-600 mt-1">Quản lý lịch làm việc và lịch hẹn của bác sĩ</p>
        </div>
        {schedules.length === 0 && (
          <Button variant="primary" onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus size={20} /> Tạo lịch làm việc
          </Button>
        )}
      </div>

      {/* Thống kê nhanh */}
      {schedules.length > 0 && schedules[0].appointments && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng lịch hẹn</p>
                <p className="text-xl font-bold text-gray-800">
                  {getAppointmentStats(schedules[0]).total}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đang chờ</p>
                <p className="text-xl font-bold text-yellow-600">
                  {getAppointmentStats(schedules[0]).pending}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã xác nhận</p>
                <p className="text-xl font-bold text-green-600">
                  {getAppointmentStats(schedules[0]).confirmed}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã hoàn thành</p>
                <p className="text-xl font-bold text-blue-600">
                  {getAppointmentStats(schedules[0]).complete}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <X className="text-red-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã hủy</p>
                <p className="text-xl font-bold text-red-600">
                  {getAppointmentStats(schedules[0]).cancelled}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lịch làm việc chính */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Calendar className="text-blue-600" size={24} />
            Lịch làm việc hiện tại
          </h2>
        </div>

        {schedules.length > 0 ? (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Thông tin lịch làm việc */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Thông tin lịch làm việc</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Ngày làm việc:</span>
                    <span className="font-medium text-gray-800">
                      {formatDays(schedules[0].workingDays)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Giờ làm việc:</span>
                    <span className="font-medium text-gray-800">
                      {schedules[0].startTime.substring(0, 5)} - {schedules[0].endTime.substring(0, 5)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Thời lượng mỗi ca:</span>
                    <span className="font-medium text-gray-800">
                      {schedules[0].slotDuration} phút
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Phí tư vấn:</span>
                    <span className="font-medium text-green-700">
                      {formatCurrency(schedules[0].consultationFee)}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="primary" 
                    onClick={() => handleEdit(schedules[0])}
                    className="flex items-center gap-2"
                  >
                    <Edit3 size={18} />
                    Chỉnh sửa lịch
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDelete(schedules[0].scheduleId)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Xóa lịch
                  </Button>
                </div>
              </div>

              {/* Thông tin lịch hẹn */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Thống kê lịch hẹn</h3>
                {schedules[0].appointments && schedules[0].appointments.length > 0 ? (
                  <div className="space-y-2">
                    {schedules[0].appointments.slice(0, 5).map((appointment) => (
                      <div key={appointment.appointmentId} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">
                              {appointment.appointmentDate} • {appointment.appointmentStart.substring(0, 5)}
                            </p>
                            <p className="text-sm text-gray-600">{appointment.reason}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            appointment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {appointment.status === 'CONFIRMED' ? 'Đã xác nhận' :
                            appointment.status === 'COMPLETED' ? 'Đã hoàn thành' :
                             appointment.status === 'PENDING' ? 'Đang chờ' : 'Đã hủy'}
                          </span>
                        </div>
                      </div>
                    ))}
                    {schedules[0].appointments.length > 5 && (
                      <p className="text-center text-sm text-gray-500">
                        Và {schedules[0].appointments.length - 5} lịch hẹn khác...
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>Chưa có lịch hẹn nào</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có lịch làm việc</h3>
            <p className="text-gray-500 mb-6">Tạo lịch làm việc đầu tiên để bắt đầu nhận lịch hẹn từ bệnh nhân</p>
            <Button variant="primary" onClick={() => setShowForm(true)} className="flex items-center gap-2 mx-auto">
              <Plus size={20} /> Tạo lịch làm việc
            </Button>
          </div>
        )}
      </div>

      {/* Form thêm / chỉnh sửa */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative mx-4">
            <button
              onClick={handleCloseForm}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditing ? 'Chỉnh sửa lịch làm việc' : 'Tạo lịch làm việc mới'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ngày làm việc trong tuần *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {daysOfWeek.map((day) => (
                    <label
                      key={day.value}
                      className="flex items-center space-x-2 cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.workingDays.includes(day.value)}
                        onChange={() => handleDayChange(day.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ bắt đầu *
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ kết thúc *
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời lượng mỗi ca *
                  </label>
                  <select
                    value={formData.slotDuration}
                    onChange={(e) =>
                      setFormData({ ...formData, slotDuration: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {slotDurations.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phí tư vấn (VNĐ) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.consultationFee}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        consultationFee: e.target.value.replace(/[^0-9]/g, ''),
                      })
                    }
                    placeholder="Nhập phí tư vấn"
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" className="flex items-center gap-2">
                  <Save size={18} />
                  {isEditing ? 'Cập nhật lịch' : 'Tạo lịch làm việc'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseForm}>
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;