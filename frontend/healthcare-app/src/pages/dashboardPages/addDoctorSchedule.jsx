import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  Plus,
  Trash2,
  Edit3
} from 'lucide-react';
import Button from '../../components/common/button';

const AddDoctorSchedule = () => {
  const [schedule, setSchedule] = useState({
    workingDays: [],
    startTime: '08:00',
    endTime: '17:00',
    consultationFee: '',
    slotDuration: 30
  });

  const [existingSchedules, setExistingSchedules] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const daysOfWeek = [
    { value: 'monday', label: 'Thứ 2' },
    { value: 'tuesday', label: 'Thứ 3' },
    { value: 'wednesday', label: 'Thứ 4' },
    { value: 'thursday', label: 'Thứ 5' },
    { value: 'friday', label: 'Thứ 6' },
    { value: 'saturday', label: 'Thứ 7' },
    { value: 'sunday', label: 'Chủ nhật' }
  ];

  const slotDurations = [
    { value: 15, label: '15 phút' },
    { value: 20, label: '20 phút' },
    { value: 30, label: '30 phút' },
    { value: 45, label: '45 phút' },
    { value: 60, label: '60 phút' }
  ];

  // Mock data - trong thực tế sẽ lấy từ API
  useEffect(() => {
    const mockSchedules = [
      {
        id: '1',
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        startTime: '08:00',
        endTime: '17:00',
        consultationFee: '300000',
        slotDuration: 30,
        status: 'active'
      },
      {
        id: '2',
        workingDays: ['saturday'],
        startTime: '08:00',
        endTime: '12:00',
        consultationFee: '350000',
        slotDuration: 30,
        status: 'active'
      }
    ];
    setExistingSchedules(mockSchedules);
  }, []);

  const handleDayChange = (day) => {
    setSchedule(prev => {
      const updatedDays = prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day];
      return { ...prev, workingDays: updatedDays };
    });
  };

  const handleTimeChange = (field, value) => {
    setSchedule(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field, value) => {
    // Chỉ cho phép số
    const numericValue = value.replace(/[^0-9]/g, '');
    setSchedule(prev => ({ ...prev, [field]: numericValue }));
  };

  const generateTimeSlots = () => {
    if (!schedule.startTime || !schedule.endTime || !schedule.slotDuration) return [];

    const slots = [];
    const start = new Date(`2000-01-01T${schedule.startTime}`);
    const end = new Date(`2000-01-01T${schedule.endTime}`);
    const duration = schedule.slotDuration;

    let current = new Date(start);
    
    while (current < end) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current.getTime() + duration * 60000);
      
      if (slotEnd <= end) {
        slots.push({
          start: slotStart.toTimeString().substring(0, 5),
          end: slotEnd.toTimeString().substring(0, 5)
        });
      }
      
      current = slotEnd;
    }

    return slots;
  };

  const calculateTotalSlots = () => {
    const slots = generateTimeSlots();
    return slots.length * schedule.workingDays.length;
  };

  const calculateWeeklyEarnings = () => {
    const totalSlots = calculateTotalSlots();
    const fee = parseInt(schedule.consultationFee) || 0;
    return totalSlots * fee;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (schedule.workingDays.length === 0) {
      alert('Vui lòng chọn ít nhất một ngày làm việc');
      return;
    }

    if (!schedule.consultationFee) {
      alert('Vui lòng nhập phí tư vấn');
      return;
    }

    const scheduleData = {
      ...schedule,
      consultationFee: schedule.consultationFee.toString()
    };

    console.log('Schedule data:', scheduleData);
    
    // Gọi API để lưu lịch làm việc
    if (isEditing) {
      console.log('Updating schedule:', editId, scheduleData);
      alert('Cập nhật lịch làm việc thành công!');
    } else {
      console.log('Creating new schedule:', scheduleData);
      alert('Tạo lịch làm việc thành công!');
    }

    // Reset form
    setSchedule({
      workingDays: [],
      startTime: '08:00',
      endTime: '17:00',
      consultationFee: '',
      slotDuration: 30
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleEdit = (scheduleItem) => {
    setSchedule({
      workingDays: scheduleItem.workingDays,
      startTime: scheduleItem.startTime,
      endTime: scheduleItem.endTime,
      consultationFee: scheduleItem.consultationFee,
      slotDuration: scheduleItem.slotDuration
    });
    setIsEditing(true);
    setEditId(scheduleItem.id);
  };

  const handleDelete = (scheduleId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch làm việc này?')) {
      console.log('Deleting schedule:', scheduleId);
      alert('Đã xóa lịch làm việc!');
    }
  };

  const handleCancelEdit = () => {
    setSchedule({
      workingDays: [],
      startTime: '08:00',
      endTime: '17:00',
      consultationFee: '',
      slotDuration: 30
    });
    setIsEditing(false);
    setEditId(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  const formatDays = (days) => {
    return days.map(day => {
      const found = daysOfWeek.find(d => d.value === day);
      return found ? found.label : day;
    }).join(', ');
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Lịch làm việc</h1>
          <p className="text-gray-600 mt-2">Quản lý thời gian làm việc và lịch hẹn</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form thêm/chỉnh sửa lịch làm việc */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditing ? 'Chỉnh sửa lịch làm việc' : 'Thêm lịch làm việc mới'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ngày làm việc */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ngày làm việc trong tuần *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {daysOfWeek.map(day => (
                    <label key={day.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schedule.workingDays.includes(day.value)}
                        onChange={() => handleDayChange(day.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Thời gian làm việc */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ bắt đầu *
                  </label>
                  <input
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) => handleTimeChange('startTime', e.target.value)}
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
                    value={schedule.endTime}
                    onChange={(e) => handleTimeChange('endTime', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian mỗi ca *
                  </label>
                  <select
                    value={schedule.slotDuration}
                    onChange={(e) => handleTimeChange('slotDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {slotDurations.map(duration => (
                      <option key={duration.value} value={duration.value}>
                        {duration.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Phí tư vấn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phí tư vấn (VNĐ) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={schedule.consultationFee}
                    onChange={(e) => handleNumberChange('consultationFee', e.target.value)}
                    placeholder="Nhập phí tư vấn"
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                {schedule.consultationFee && (
                  <p className="text-sm text-gray-600 mt-1">
                    {formatCurrency(parseInt(schedule.consultationFee) || 0)}
                  </p>
                )}
              </div>

              {/* Preview */}
              {schedule.workingDays.length > 0 && schedule.startTime && schedule.endTime && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">Xem trước lịch làm việc</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600 font-medium">Số ngày làm việc:</span>
                      <p>{schedule.workingDays.length} ngày/tuần</p>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">Tổng số ca/tuần:</span>
                      <p>{calculateTotalSlots()} ca</p>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">Doanh thu ước tính/tuần:</span>
                      <p className="font-semibold">{formatCurrency(calculateWeeklyEarnings())}</p>
                    </div>
                  </div>

                  {/* Chi tiết các ca làm việc */}
                  {timeSlots.length > 0 && (
                    <div className="mt-3">
                      <span className="text-blue-600 font-medium text-sm">Các ca trong ngày:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {timeSlots.map((slot, index) => (
                          <span 
                            key={index}
                            className="bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded text-xs"
                          >
                            {slot.start} - {slot.end}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" className="flex items-center gap-2">
                  <Save size={18} />
                  {isEditing ? 'Cập nhật lịch làm việc' : 'Tạo lịch làm việc'}
                </Button>
                
                {isEditing && (
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    Hủy
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Danh sách lịch làm việc hiện tại */}
        <div className="space-y-6">
          {/* Thống kê nhanh */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tổng lịch làm việc:</span>
                <span className="font-semibold">{existingSchedules.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ngày đang hoạt động:</span>
                <span className="font-semibold">
                  {Array.from(new Set(existingSchedules.flatMap(s => s.workingDays))).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phí TB:</span>
                <span className="font-semibold">
                  {formatCurrency(
                    existingSchedules.reduce((acc, curr) => acc + parseInt(curr.consultationFee), 0) / 
                    Math.max(existingSchedules.length, 1)
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Lịch làm việc hiện tại */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Lịch làm việc hiện tại</h3>
            
            {existingSchedules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={48} className="mx-auto mb-3 text-gray-300" />
                <p>Chưa có lịch làm việc nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {existingSchedules.map(scheduleItem => (
                  <div key={scheduleItem.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {formatDays(scheduleItem.workingDays)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {scheduleItem.startTime} - {scheduleItem.endTime}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        scheduleItem.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {scheduleItem.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="text-gray-600">Phí: </span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(parseInt(scheduleItem.consultationFee))}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(scheduleItem)}
                          className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(scheduleItem.id)}
                          className="p-1 text-red-600 hover:text-red-700 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorSchedule;