import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Calendar, MapPin, FileText, CreditCard, Clock } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import FormField from '../../components/common/formField';
import Button from '../../components/common/button';
import BookingService from '../../service/bookingService';
import PatientService from '../../service/patientService';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const doctorId = searchParams.get('doctorId');
  const selectedDate = searchParams.get('date');
  const selectedTime = searchParams.get('time');

  const [doctorInfo, setDoctorInfo] = useState({
    name: 'Đang tải...',
    specialty: 'Đang tải...',
    experience: 'Đang tải...',
    location: 'Đang tải...',
    price: 0,
    clinicName: '',
    address: '',
    district: '',
    city: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [scheduleData, setScheduleData] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(selectedTime || '');
  const [userId, setUserId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    gender: 'FEMALE',
    phone: '',
    email: '',
    dateOfBirth: '',
    city: '',
    district: '',
    address: '',
    insuranceNum: '',
    reason: '',
    appointmentDate: selectedDate || '',
    appointmentTime: selectedTime || '',
    paymentMethod: 'cash'
  });

  // Generate time slots based on schedule
  const generateTimeSlots = (schedule) => {
    if (!schedule) return [];
    
    const slots = [];
    const startTime = new Date(`1970-01-01T${schedule.startTime}`);
    const endTime = new Date(`1970-01-01T${schedule.endTime}`);
    const slotDuration = schedule.slotDuration || 30; // minutes
    
    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const timeString = currentTime.toTimeString().slice(0, 5);
      slots.push(timeString);
      
      // Add slot duration
      currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
    }
    
    return slots;
  };

  // Get user info from token
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      // Decode JWT token to get user info
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.sub;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Fetch doctor info và schedule khi component mount
  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        if (!doctorId) {
          throw new Error('Doctor ID is required');
        }

        // Get user ID from token
        const currentUserId = getUserIdFromToken();
        if (!currentUserId) {
          throw new Error('Cannot get user information from token');
        }
        setUserId(currentUserId);

        // Fetch doctor details
        const doctorResponse = await fetch(
          `http://localhost:8082/api/doctors/${doctorId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!doctorResponse.ok) {
          throw new Error(`HTTP error! status: ${doctorResponse.status}`);
        }

        const doctorData = await doctorResponse.json();
        console.log('Doctor data:', doctorData);

        // Fetch schedule data
        const scheduleResponse = await fetch(
          `http://localhost:8081/schedules/by-doctor?doctorId=${doctorId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (scheduleResponse.ok) {
          const scheduleData = await scheduleResponse.json();
          console.log('Schedule data:', scheduleData);
          setScheduleData(scheduleData);
          
          // Generate time slots from schedule
          const timeSlots = generateTimeSlots(scheduleData);
          setAvailableTimeSlots(timeSlots);
        }

        // Update doctor info state với dữ liệu thực tế từ API
        setDoctorInfo({
          name: doctorData.fullName || 'BS. Chưa có tên',
          specialty: doctorData.clinicDescription || 'Chưa có chuyên khoa',
          experience: doctorData.bio || 'Chưa có thông tin kinh nghiệm',
          location: `${doctorData.district || ''}, ${doctorData.city || ''}`.trim() || 'Chưa có địa điểm',
          price: scheduleData?.consultationFee || doctorData.price || 300000,
          clinicName: doctorData.clinicName || 'Chưa có tên phòng khám',
          address: doctorData.address || '',
          district: doctorData.district || '',
          city: doctorData.city || ''
        });

        // Update form data với ngày và giờ đã chọn
        setFormData(prev => ({
          ...prev,
          appointmentDate: selectedDate || '',
          appointmentTime: selectedTime || '',
          city: doctorData.city || '',
          district: doctorData.district || ''
        }));

        // Set selected time slot
        if (selectedTime) {
          setSelectedTimeSlot(selectedTime);
        }

      } catch (err) {
        console.error('Error fetching doctor info:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctorInfo();
    } else {
      setError('Không tìm thấy thông tin bác sĩ');
      setLoading(false);
    }
  }, [doctorId, selectedDate, selectedTime]);

  // Get user info and auto-fill form
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const currentUserId = getUserIdFromToken();
      
      if (!token || !currentUserId) return;

      // Gọi API để lấy thông tin user
      const userResponse = await fetch(
        `http://localhost:8082/api/users/${currentUserId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('User data:', userData);
        
        // Tự động điền email và số điện thoại vào form
        setFormData(prev => ({
          ...prev,
          email: userData.email || '',
          phone: userData.phone || ''
        }));

        // Nếu đã có patient, lấy thông tin patient để điền form
        try {
          const patientData = await PatientService.getPatientByUserId(currentUserId, token);
          console.log('Existing patient data:', patientData);
          
          // Tự động điền thông tin patient vào form
          setFormData(prev => ({
            ...prev,
            patientName: patientData.fullName || '',
            gender: patientData.gender || 'FEMALE',
            dateOfBirth: patientData.dateOfBirth || '',
            city: patientData.city || '',
            district: patientData.district || '',
            address: patientData.address || '',
            insuranceNum: patientData.insuranceNum || ''
          }));
        } catch (patientError) {
          console.log('No existing patient found, user will fill form manually');
        }
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  // Fetch user info khi component mount
  useEffect(() => {
    const fetchUserAndAutoFill = async () => {
      await fetchUserInfo();
    };
    
    fetchUserAndAutoFill();
  }, []);

  const handleTimeSlotClick = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setFormData(prev => ({
      ...prev,
      appointmentTime: timeSlot
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Không cho phép thay đổi ngày và giờ khám
    if (name === 'appointmentDate' || name === 'appointmentTime') {
      return;
    }
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Create booking using BookingService
  const createBooking = async () => {
    const token = localStorage.getItem('token');
    
    if (!token || !userId) {
      throw new Error('Authentication required');
    }

    try {
      const result = await BookingService.createBooking(
        userId, 
        formData, 
        scheduleData, 
        doctorInfo, 
        token
      );
      
      console.log('Booking process completed:', result);
      return result;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      console.log('Submitting booking with data:', formData);
      
      // Validate required fields
      if (!formData.patientName || !formData.phone || !formData.email || 
          !formData.dateOfBirth || !formData.appointmentDate || !formData.appointmentTime) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      // Kiểm tra đã chọn giờ khám chưa
      if (!selectedTimeSlot) {
        alert('Vui lòng chọn giờ khám');
        return;
      }

      // Create booking using service
      const result = await createBooking();
      
      console.log('Booking process completed:', result);

      // Chuyển đến trang thành công với đầy đủ dữ liệu
      navigate('/bookingsuccess', { 
        state: {
          appointmentId: result.appointmentId,
          patientId: result.patientId,
          doctorName: result.doctorName,
          appointmentDate: result.appointmentDate,
          appointmentStart: result.appointmentStart,
          appointmentEnd: result.appointmentEnd,
          reason: result.reason,
          status: result.status,
          totalPrice: result.totalPrice,
          interactedAt: new Date().toISOString()
        }
      });

    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại. ' + err.message);
    } finally {
      setSubmitting(false);
    }
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
      <div className="min-h-screen bg-gray-50 py-8 mt-30 flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
        <Button 
          onClick={() => window.history.back()} 
          variant="primary" 
          className="ml-4"
        >
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              {/* Doctor Image */}
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <User size={64} className="text-gray-400" />
              </div>

              {/* Doctor Details */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {doctorInfo.name}
              </h3>
              <p className="text-sm text-gray-600 mb-1">{doctorInfo.specialty}</p>
              <p className="text-sm text-gray-600 mb-3">{doctorInfo.experience}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={18} />
                  <span className="text-sm">{doctorInfo.clinicName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 pl-6">
                  <span className="text-sm">{doctorInfo.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 pl-6">
                  <span className="text-sm">{doctorInfo.location}</span>
                </div>
              </div>

              {/* Price Info */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Giá khám:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {doctorInfo.price.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              {/* Date & Time Selection */}
              <div className="border-t pt-4 space-y-4">
                {/* Ngày khám - Chỉ hiển thị, không cho chỉnh sửa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày khám
                  </label>
                  <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                    {selectedDate || 'Chưa chọn ngày'}
                  </div>
                </div>

                {/* Giờ khám - Hiển thị slot thời gian */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ khám
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((timeSlot, index) => (
                        <div 
                          key={index}
                          onClick={() => handleTimeSlotClick(timeSlot)}
                          className={`py-2 px-3 border rounded-lg text-sm font-medium text-center cursor-pointer transition duration-150 ${
                            selectedTimeSlot === timeSlot
                              ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                              : 'border-blue-400 bg-blue-50 text-blue-800 hover:bg-blue-100'
                          }`}
                        >
                          {timeSlot}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 py-2 px-3 border border-gray-300 bg-gray-100 text-gray-500 rounded-lg text-sm text-center">
                        Không có lịch khám cho ngày này
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Thông tin bệnh nhân
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Patient Name */}
                <FormField
                  icon={User}
                  label="Họ và tên người bệnh (Đặt hộ)"
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  required
                />

                {/* Gender Selection */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <User size={20} className="text-gray-700" />
                    </div>
                    <label className="text-gray-800 font-medium">Giới tính</label>
                  </div>
                  <div className="flex gap-6 pl-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="MALE"
                        checked={formData.gender === 'MALE'}
                        onChange={handleChange}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span>Nam</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="FEMALE"
                        checked={formData.gender === 'FEMALE'}
                        onChange={handleChange}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span>Nữ</span>
                    </label>
                  </div>
                </div>

                {/* Phone */}
                <FormField
                  icon={Phone}
                  label="Số điện thoại"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  required
                />

                {/* Email */}
                <FormField
                  icon={Mail}
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                  required
                />

                {/* Date of Birth */}
                <FormField
                  icon={Calendar}
                  label="Ngày tháng năm sinh"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />

                {/* Insurance Number */}
                <FormField
                  icon={CreditCard}
                  label="Số bảo hiểm y tế (nếu có)"
                  type="text"
                  name="insuranceNum"
                  value={formData.insuranceNum}
                  onChange={handleChange}
                  placeholder="Nhập số bảo hiểm y tế"
                />

                {/* City */}
                <FormField
                  icon={MapPin}
                  label="Tỉnh thành"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Tỉnh thành"
                  required
                />

                {/* District */}
                <FormField
                  icon={MapPin}
                  label="Quận/Huyện"
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Quận/Huyện"
                  required
                />

                {/* Address */}
                <FormField
                  icon={MapPin}
                  label="Địa chỉ"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ chi tiết"
                  required
                />

                {/* Reason */}
                <FormField
                  icon={FileText}
                  label="Lý do khám"
                  as="textarea"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Mô tả triệu chứng hoặc lý do khám bệnh..."
                  rows={4}
                />

                {/* Selected Time Display */}
                {selectedTimeSlot && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <Clock size={18} />
                      <span className="font-semibold">Đã chọn:</span>
                      <span>{selectedDate} lúc {selectedTimeSlot}</span>
                    </div>
                  </div>
                )}

                {/* Price Summary */}
                <div className="bg-blue-600 text-white rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg">Giá khám:</span>
                    <span className="text-2xl font-bold">
                      {doctorInfo.price.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="border-t border-blue-400 pt-3 flex justify-between items-center">
                    <span className="text-lg">Tổng cộng:</span>
                    <span className="text-3xl font-bold text-yellow-300">
                      {doctorInfo.price.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth
                  disabled={!selectedTimeSlot || submitting}
                >
                  {submitting ? 'Đang xử lý...' : selectedTimeSlot ? 'Đặt lịch ngay' : 'Vui lòng chọn giờ khám'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;