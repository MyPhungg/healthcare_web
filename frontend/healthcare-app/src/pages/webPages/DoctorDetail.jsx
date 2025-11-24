import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Star, Award, Clock4, Phone, Mail } from 'lucide-react';

const DoctorDetail = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [schedule, setSchedule] = useState(null); // SỬA: đổi từ [] thành null
  const [loading, setLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(true); // SỬA: sửa chính tả
  const [error, setError] = useState(null);

  // Fetch doctor details only
  useEffect(() => {
    const fetchDoctorDetail = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('Fetching doctor detail for ID:', doctorId);

        // Fetch doctor details only
        const response = await fetch(
          `http://localhost:8082/api/doctors/${doctorId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // Read response as text first
        const responseText = await response.text();
        console.log('Raw doctor response:', responseText.substring(0, 200) + '...');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
        }

        // Check if response is empty
        if (!responseText || responseText.trim() === '') {
          throw new Error('Empty response from server');
        }

        let doctorData;
        try {
          // Try to parse JSON
          doctorData = JSON.parse(responseText);
          console.log('Parsed doctor data:', doctorData);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          console.error('Invalid JSON response:', responseText);
          
          // Handle non-JSON responses
          if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
            throw new Error('Server returned HTML error page');
          } else {
            throw new Error('Invalid response format from server');
          }
        }

        setDoctor(doctorData);
        setError(null);

      } catch (err) {
        console.error('Error fetching doctor detail:', err);
        setError(err.message);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctorDetail();
    } else {
      setError('Không tìm thấy ID bác sĩ');
      setLoading(false);
    }
  }, [doctorId]);

  //Fetch schedule doctor
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!doctorId) return;

      try {
        setScheduleLoading(true); // SỬA: đã sửa chính tả
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('Fetching schedule for doctor ID:', doctorId);

        const response = await fetch(
          `http://localhost:8081/schedules/by-doctor?doctorId=${doctorId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const scheduleData = await response.json();
        console.log('Schedule data:', scheduleData);
        
        setSchedule(scheduleData);
      } catch (err) {
        console.error('Error fetching schedule:', err);
        // Không set error chính vì schedule là thông tin phụ
      } finally {
        setScheduleLoading(false); // SỬA: đã sửa chính tả
      }
    };

    fetchSchedule();
  }, [doctorId]);

  // Generate calendar days for display (static data)
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    // Tạo 7 ngày tiếp theo
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  // Generate sample time slots for display
  const generateTimeSlots = (date) => {
    if (!schedule || !schedule.startTime) { // SỬA: thêm điều kiện check schedule.startTime
      return generateSampleTimeSlots(); // Fallback nếu không có schedule
    }

    const slots = [];
    const startTime = schedule.startTime; // "08:00:00"
    const endTime = schedule.endTime; // "12:00:00"
    const slotDuration = schedule.slotDuration || 30; // 30 phút

    // Chuyển đổi thời gian từ string sang số
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    // Kiểm tra ngày hiện tại có phải là ngày làm việc không
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const currentDay = dayNames[date.getDay()];
    const workingDays = schedule.workingDays?.split(',') || [];

    if (!workingDays.includes(currentDay)) {
      return []; // Không có khung giờ nếu không làm việc
    }

    // Tạo các khung giờ
    for (let time = startTotalMinutes; time < endTotalMinutes; time += slotDuration) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Kiểm tra xem khung giờ này đã được đặt chưa
      const isBooked = isTimeSlotBooked(date, timeString);
      
      slots.push({
        time: timeString,
        available: !isBooked
      });
    }
    
    return slots;
  };

  // Kiểm tra khung giờ đã được đặt chưa
  const isTimeSlotBooked = (date, timeString) => {
    if (!schedule || !schedule.appointments) return false;

    const dateString = date.toISOString().split('T')[0];
    
    return schedule.appointments.some(appointment => {
      const isSameDate = appointment.appointmentDate === dateString;
      const isSameTime = appointment.appointmentStart.substring(0, 5) === timeString;
      const isActiveStatus = appointment.status === 'PENDING' || appointment.status === 'CONFIRMED';
      
      return isSameDate && isSameTime && isActiveStatus;
    });
  };

  const generateSampleTimeSlots = () => {
    const slots = [];
    const startHour = 8;
    const endHour = 12;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time: timeString,
          available: true
        });
      }
    }
    
    return slots;
  };

  // Format date for display
  const formatDate = (date) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('vi-VN', options);
  };

  // Handle book appointment với validation
  const handleBookAppointment = (date, time, available) => {
    if (!available) {
      alert('Khung giờ này đã được đặt. Vui lòng chọn khung giờ khác.');
      return;
    }

    const dateString = date.toISOString().split('T')[0];
    navigate(`/booking?doctorId=${doctorId}&date=${dateString}&time=${time}`);
  };

  // Handle direct booking
  const handleBookNow = () => {
    navigate(`/booking?doctorId=${doctorId}`);
  };

  const formatWorkingDays = () => {
    if (!schedule || !schedule.workingDays) return 'Thứ 2 - Chủ nhật';

    const dayMap = {
      'MON': 'Thứ 2',
      'TUE': 'Thứ 3',
      'WED': 'Thứ 4',
      'THU': 'Thứ 5',
      'FRI': 'Thứ 6',
      'SAT': 'Thứ 7',
      'SUN': 'Chủ nhật'
    };

    const days = schedule.workingDays.split(',').map(day => dayMap[day] || day);
    
    if (days.length === 7) return 'Thứ 2 - Chủ nhật';
    return days.join(', ');
  };

  // Format time để hiển thị
  const formatTimeDisplay = (timeString) => {
    if (!timeString) return '08:00';
    const time = timeString.substring(0, 5);
    return time;
  };

  // Retry function
  const handleRetry = () => {
    setLoading(true);
    setError(null);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 mt-30 flex items-center justify-center">
        <div className="text-lg">Đang tải thông tin bác sĩ...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 mt-30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="text-red-500 text-lg text-center">{error}</div>
            <button 
              onClick={handleRetry}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 mt-30 flex items-center justify-center">
        <div className="text-red-500 text-lg">Không tìm thấy thông tin bác sĩ</div>
      </div>
    );
  }

  const calendarDays = generateCalendarDays();

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-30">
      <div className="container mx-auto px-4">
        {/* Doctor Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Doctor Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-lg">
                {doctor.profileImg ? (
                  <img 
                    src={doctor.profileImg} 
                    alt={doctor.fullName}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="text-4xl text-blue-600 font-bold">
                    {doctor.fullName?.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Doctor Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {doctor.fullName}
                  </h1>
                  <p className="text-lg text-blue-600 font-semibold mb-2">
                    {doctor.specialityName || doctor.clinicDescription || 'Bác sĩ chuyên khoa'}
                  </p>
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span>4.9</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award size={16} className="text-green-500" />
                      <span>{doctor.bio || '10+ năm kinh nghiệm'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                     {schedule?.consultationFee 
                      ? `${schedule.consultationFee.toLocaleString('vi-VN')} đ` 
                      : doctor.price 
                        ? `${doctor.price.toLocaleString('vi-VN')} đ` 
                        : '300.000 đ'
                    } 
                  </div>
                  <div className="text-sm text-gray-600">Giá khám</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={18} className="text-red-500" />
                  <span>{doctor.address}, {doctor.district}, {doctor.city}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock4 size={18} className="text-blue-500" />
                  {/* Hiển thị lịch làm việc thực tế */}
                  <span>
                    Làm việc: {formatWorkingDays()} • 
                    {schedule 
                      ? ` ${formatTimeDisplay(schedule.startTime)} - ${formatTimeDisplay(schedule.endTime)}`
                      : ' 08:00 - 17:00'
                    }
                  </span>
                </div>
              </div>

              {/* Bio */}
              {doctor.bio && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar View - Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Lịch làm việc</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} />
                  {/* Hiển thị thời gian mỗi lượt khám thực tế */}
                  <span>
                    Mỗi lượt khám: {schedule?.slotDuration || 30} phút
                  </span>
                </div>
              </div>
              
              {/* Loading indicator cho lịch */}
              {scheduleLoading && (
                <div className="text-center py-4 text-gray-500">
                  Đang tải lịch làm việc...
                </div>
              )}

              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {calendarDays.map((date, index) => {
                  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
                  const currentDay = dayNames[date.getDay()];
                  const workingDays = schedule?.workingDays?.split(',') || [];
                  const isWorkingDay = workingDays.includes(currentDay);

                  return (
                    <div
                      key={index}
                      className={`text-center p-3 rounded-lg border ${
                        isWorkingDay 
                          ? 'border-blue-200 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 bg-gray-100 text-gray-400'
                      }`}
                    >
                      <div className="font-semibold">{formatDate(date)}</div>
                      <div className="text-sm opacity-75">
                        {date.toLocaleDateString('vi-VN', { day: 'numeric' })}
                      </div>
                      {!isWorkingDay && (
                        <div className="text-xs mt-1">Nghỉ</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Time Slots Grid - Dữ liệu thực tế từ API */}
              {!scheduleLoading && (
                <div className="space-y-4">
                  {calendarDays.map((date, dayIndex) => {
                    const isToday = date.toDateString() === new Date().toDateString();
                    const timeSlots = generateTimeSlots(date);
                    const availableSlots = timeSlots.filter(slot => slot.available);
                    
                    return (
                      <div key={dayIndex} className="border border-gray-200 rounded-lg">
                        <div className={`p-3 border-b ${
                          isToday ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-gray-800">
                              {formatDate(date)}
                              {isToday && <span className="ml-2 text-blue-600 text-sm">(Hôm nay)</span>}
                            </div>
                            <div className="text-sm text-gray-500">
                              {availableSlots.length} lượt khám có sẵn
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          {timeSlots.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                              Bác sĩ không làm việc vào ngày này
                            </div>
                          ) : (
                            <>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {timeSlots.slice(0, 12).map((slot, timeIndex) => (
                                  <button
                                    key={timeIndex}
                                    onClick={() => handleBookAppointment(date, slot.time, slot.available)}
                                    disabled={!slot.available}
                                    className={`p-3 text-sm font-medium rounded-lg transition duration-150 text-center ${
                                      slot.available
                                        ? 'text-blue-800 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                                        : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                                    }`}
                                  >
                                    {slot.time}
                                    {!slot.available && (
                                      <div className="text-xs text-red-500 mt-1">Đã đặt</div>
                                    )}
                                  </button>
                                ))}
                              </div>
                              {timeSlots.length > 12 && (
                                <div className="text-center mt-4">
                                  <button
                                    onClick={handleBookNow}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                  >
                                    Xem thêm {timeSlots.length - 12} giờ khám...
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Clinic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Thông tin phòng khám</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">{doctor.clinicName || 'Phòng khám'}</h4>
                  <p className="text-sm text-gray-600 mb-1">{doctor.clinicDescription || 'Chuyên khám và tư vấn bệnh lý'}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{doctor.address}, {doctor.district}, {doctor.city}</span>
                  </div>
                  
                  {/* Hiển thị thông tin giờ làm việc thực tế */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-blue-500" />
                    <span>
                      {schedule 
                        ? `${formatTimeDisplay(schedule.startTime)} - ${formatTimeDisplay(schedule.endTime)}`
                        : '08:00 - 17:00'
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-green-500" />
                    <span>{formatWorkingDays()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleBookNow}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                  >
                    Đặt lịch khám ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;