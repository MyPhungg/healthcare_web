import React, { useState, useEffect } from 'react';
import { 
  User, Phone, Mail, Calendar, MapPin, FileText, CreditCard, Clock,
  Shield, Wallet, Banknote, ChevronRight, AlertCircle
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import FormField from '../../components/common/formField';
import Button from '../../components/common/button';
import BookingService from '../../service/bookingService';
import PatientService from '../../service/patientService';
import PaymentService from '../../service/paymentService';

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
  
  // State cho thanh toán
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [currentStep, setCurrentStep] = useState(1); // 1: Form, 2: Payment
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, failed

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
    appointmentTime: selectedTime || ''
  });

  // Get user info from token
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.sub;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Generate time slots based on schedule
  const generateTimeSlots = (schedule) => {
    if (!schedule) return [];
    
    const slots = [];
    const startTime = new Date(`1970-01-01T${schedule.startTime}`);
    const endTime = new Date(`1970-01-01T${schedule.endTime}`);
    const slotDuration = schedule.slotDuration || 30;
    
    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const timeString = currentTime.toTimeString().slice(0, 5);
      slots.push(timeString);
      currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
    }
    
    return slots;
  };

  // Fetch doctor info and schedule
  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Vui lòng đăng nhập để đặt lịch');
        }

        if (!doctorId) {
          throw new Error('Không tìm thấy thông tin bác sĩ');
        }

        // Get user ID
        const currentUserId = getUserIdFromToken();
        if (!currentUserId) {
          throw new Error('Không thể lấy thông tin người dùng');
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
          throw new Error('Không thể tải thông tin bác sĩ');
        }

        const doctorData = await doctorResponse.json();

        // Fetch schedule
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

        let scheduleData = null;
        if (scheduleResponse.ok) {
          scheduleData = await scheduleResponse.json();
          setScheduleData(scheduleData);
          
          // Generate time slots
          const timeSlots = generateTimeSlots(scheduleData);
          setAvailableTimeSlots(timeSlots);
        }

        // Update doctor info
        setDoctorInfo({
          name: doctorData.fullName || 'BS. Chưa có tên',
          specialty: doctorData.clinicDescription || 'Chưa có chuyên khoa',
          experience: doctorData.bio || 'Chưa có thông tin kinh nghiệm',
          price: scheduleData?.consultationFee || doctorData.price || 300000,
          clinicName: doctorData.clinicName || 'Chưa có tên phòng khám',
          address: doctorData.address || '',
          district: doctorData.district || '',
          city: doctorData.city || ''
        });

        // Update form data
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

  // Fetch user info for auto-fill
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const currentUserId = getUserIdFromToken();
      
      if (!token || !currentUserId) return;

      // Get user info
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
        
        setFormData(prev => ({
          ...prev,
          email: userData.email || '',
          phone: userData.phone || ''
        }));

        // Try to get existing patient info
        try {
          const patientData = await PatientService.getPatientByUserId(currentUserId);
          
          if (patientData) {
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
          }
        } catch (patientError) {
          console.log('No existing patient found');
        }
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  // Fetch user info on mount
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Trong Booking component, sửa:
useEffect(() => {
  const checkPendingPayment = () => {
    try {
      // Kiểm tra nếu PaymentService có phương thức hasPendingPayment
      if (typeof PaymentService.hasPendingPayment === 'function') {
        const hasPending = PaymentService.hasPendingPayment();
        if (hasPending) {
          const pendingPayment = PaymentService.getPendingPayment();
          console.log('Found pending payment:', pendingPayment);
        }
      } else {
        // Fallback: kiểm tra localStorage trực tiếp
        const pendingPayment = localStorage.getItem('pendingPayment');
        if (pendingPayment) {
          console.log('Found pending payment in localStorage:', JSON.parse(pendingPayment));
        }
      }
    } catch (error) {
      console.error('Error checking pending payment:', error);
    }
  };
  
  checkPendingPayment();
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
    if (name === 'appointmentDate' || name === 'appointmentTime') return;
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Tạo booking
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

  // Xử lý thanh toán MoMo - SỬA LẠI
  const handleMomoPayment = async (appointmentData) => {
    try {
      setPaymentStatus('processing');
      console.log('Processing MoMo payment for:', appointmentData);
      
      // Tạo thanh toán MoMo
      const paymentResult = await PaymentService.createMomoPayment(
        appointmentData.appointmentId,
        appointmentData.totalPrice,
        appointmentData.patientName || formData.patientName,
        appointmentData.doctorName || doctorInfo.name,
        appointmentData.appointmentDate,
        appointmentData.appointmentStart
      );
      
      console.log('MoMo payment result:', paymentResult);
      
      if (paymentResult.payUrl) {
        // Lưu thông tin vào localStorage sử dụng PaymentService
        const pendingPaymentData = {
          appointmentId: appointmentData.appointmentId,
          patientId: appointmentData.patientId,
          patientName: appointmentData.patientName || formData.patientName,
          doctorName: appointmentData.doctorName || doctorInfo.name,
          appointmentDate: appointmentData.appointmentDate,
          appointmentStart: appointmentData.appointmentStart,
          appointmentEnd: appointmentData.appointmentEnd,
          totalPrice: appointmentData.totalPrice,
          reason: appointmentData.reason,
          momoPaymentId: paymentResult.paymentId || paymentResult.appointmentId,
          timestamp: Date.now()
        };
        
        // Sử dụng PaymentService để lưu
        PaymentService.savePendingPayment(pendingPaymentData);
        console.log('Saved pending payment:', pendingPaymentData);
        
        // Mở MoMo trong tab mới
        window.open(paymentResult.payUrl, '_blank');
        
        // Hoặc hiển thị thông báo
        alert('Đang chuyển đến trang thanh toán MoMo. Nếu không tự động chuyển, vui lòng click vào link bên dưới.');
        
        // Tạo link để user click nếu popup bị chặn
        const paymentLink = document.createElement('a');
        paymentLink.href = paymentResult.payUrl;
        paymentLink.target = '_blank';
        paymentLink.textContent = 'Click vào đây để thanh toán';
        paymentLink.className = 'text-blue-600 underline';
        
        // Có thể hiển thị link trong một div nào đó
        const linkContainer = document.getElementById('payment-link-container');
        if (linkContainer) {
          linkContainer.innerHTML = '';
          linkContainer.appendChild(paymentLink);
        }
        
      } else {
        throw new Error('Không nhận được link thanh toán từ MoMo');
      }
    } catch (error) {
      console.error('MoMo payment error:', error);
      setPaymentStatus('failed');
      throw error;
    }
  };

  // Xử lý thanh toán tiền mặt
  const handleCashPayment = async (appointmentData) => {
    try {
      console.log('Processing cash payment for:', appointmentData);
      
      // Xóa pending payment nếu có
      PaymentService.clearPendingPayment();
      
      // Chuyển đến trang thành công
      navigate('/bookingsuccess', { 
        state: {
          ...appointmentData,
          paymentMethod: 'cash',
          paymentStatus: 'pending_cash',
          message: 'Vui lòng thanh toán khi đến phòng khám'
        }
      });
      
    } catch (error) {
      console.error('Cash payment error:', error);
      throw error;
    }
  };

  // Xử lý chọn phương thức thanh toán
  const handlePaymentMethodSelect = async (method) => {
    setPaymentMethod(method);
    
    if (!createdAppointment) {
      alert('Không tìm thấy thông tin lịch hẹn');
      return;
    }

    try {
      setSubmitting(true);
      
      if (method === 'momo') {
        await handleMomoPayment(createdAppointment);
      } else if (method === 'cash') {
        await handleCashPayment(createdAppointment);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Lỗi thanh toán: ' + error.message);
      setSubmitting(false);
      setPaymentStatus('failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      // Validate required fields
      const requiredFields = ['patientName', 'phone', 'email', 'dateOfBirth', 'appointmentDate', 'appointmentTime'];
      for (const field of requiredFields) {
        if (!formData[field]) {
          alert(`Vui lòng điền ${field === 'patientName' ? 'họ tên' : field}`);
          setSubmitting(false);
          return;
        }
      }

      if (!selectedTimeSlot) {
        alert('Vui lòng chọn giờ khám');
        setSubmitting(false);
        return;
      }

      // Tạo booking
      const result = await createBooking();
      
      console.log('Booking created:', result);
      
      // Lưu thông tin appointment đã tạo
      setCreatedAppointment(result);
      
      // Chuyển đến bước chọn phương thức thanh toán
      setShowPaymentStep(true);
      setCurrentStep(2);
      
    } catch (err) {
      console.error('Error in booking process:', err);
      alert('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại. ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Quay lại bước trước
  const goBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setShowPaymentStep(false);
    } else if (currentStep === 3) {
      setCurrentStep(2);
      setPaymentStatus('idle');
    }
    setSubmitting(false);
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
        {/* Booking Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className={`ml-2 font-medium ${currentStep === 1 ? 'text-blue-600' : 'text-gray-600'}`}>
                Thông tin bệnh nhân
              </div>
            </div>
            
            <div className="mx-4 w-12 h-px bg-gray-300"></div>
            
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <div className={`ml-2 font-medium ${currentStep === 2 ? 'text-blue-600' : 'text-gray-600'}`}>
                Thanh toán
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              {/* Doctor Image */}
              <div className="w-full h-48 bg-blue-50 rounded-lg mb-4 flex items-center justify-center">
                <User size={64} className="text-blue-400" />
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
                  <span className="text-sm">{doctorInfo.district}, {doctorInfo.city}</span>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày khám
                  </label>
                  <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                    {selectedDate || 'Chưa chọn ngày'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ khám
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
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
              {currentStep === 1 ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Thông tin bệnh nhân
                  </h2>

                  <form onSubmit={handleSubmit}>
                    {/* Patient Info Fields */}
                    <FormField
                      icon={User}
                      label="Họ và tên người bệnh"
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
                        <User size={20} className="text-gray-700" />
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

                    <FormField
                      icon={Calendar}
                      label="Ngày tháng năm sinh"
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />

                    <FormField
                      icon={CreditCard}
                      label="Số bảo hiểm y tế (nếu có)"
                      type="text"
                      name="insuranceNum"
                      value={formData.insuranceNum}
                      onChange={handleChange}
                      placeholder="Nhập số bảo hiểm y tế"
                    />

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
                      {submitting ? 'Đang xử lý...' : selectedTimeSlot ? 'Tiếp tục thanh toán' : 'Vui lòng chọn giờ khám'}
                      {!submitting && <ChevronRight size={20} className="ml-2" />}
                    </Button>

                    {/* Security Notice */}
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-700">
                        <Shield size={16} />
                        <span className="text-sm">
                          Thông tin của bạn được bảo mật và chỉ sử dụng cho mục đích khám chữa bệnh
                        </span>
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                /* Payment Options */
                <div className="text-center py-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Chọn phương thức thanh toán
                    </h3>
                    <p className="text-gray-600">
                      Lịch hẹn của bạn đã được tạo. Vui lòng chọn phương thức thanh toán
                    </p>
                  </div>

                  {/* Appointment Info */}
                  {createdAppointment && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-left">
                          <p className="text-gray-600">Mã lịch hẹn:</p>
                          <p className="font-semibold">{createdAppointment.appointmentId}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-gray-600">Bệnh nhân:</p>
                          <p className="font-semibold">{createdAppointment.patientName || formData.patientName}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-gray-600">Bác sĩ:</p>
                          <p className="font-semibold">{createdAppointment.doctorName}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-gray-600">Thời gian:</p>
                          <p className="font-semibold">
                            {createdAppointment.appointmentDate} {createdAppointment.appointmentStart}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Methods */}
                  {paymentStatus === 'idle' && (
                    <>
                      <div className="space-y-4 mb-8">
                        <div 
                          onClick={() => setPaymentMethod('momo')}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentMethod === 'momo' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                                <Wallet size={24} className="text-pink-600" />
                              </div>
                              <div className="text-left">
                                <p className="font-semibold text-gray-800">Ví MoMo</p>
                                <p className="text-sm text-gray-600">Thanh toán nhanh qua ứng dụng MoMo</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-blue-600">
                                {doctorInfo.price.toLocaleString('vi-VN')} đ
                              </p>
                              {paymentMethod === 'momo' && (
                                <p className="text-xs text-blue-500 mt-1">Được chọn</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div 
                          onClick={() => setPaymentMethod('cash')}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentMethod === 'cash' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Banknote size={24} className="text-green-600" />
                              </div>
                              <div className="text-left">
                                <p className="font-semibold text-gray-800">Thanh toán tại phòng khám</p>
                                <p className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi đến khám</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-blue-600">
                                {doctorInfo.price.toLocaleString('vi-VN')} đ
                              </p>
                              {paymentMethod === 'cash' && (
                                <p className="text-xs text-blue-500 mt-1">Được chọn</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          type="button"
                          variant="outline"
                          fullWidth
                          onClick={goBack}
                          disabled={submitting}
                        >
                          Quay lại
                        </Button>
                        <Button 
                          type="button"
                          variant="primary"
                          fullWidth
                          onClick={() => handlePaymentMethodSelect(paymentMethod)}
                          disabled={submitting}
                        >
                          {submitting ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                        </Button>
                      </div>
                      
                      {/* Container cho payment link */}
                      <div id="payment-link-container" className="mt-4"></div>
                    </>
                  )}

                  {/* Payment Processing Status */}
                  {paymentStatus === 'processing' && (
                    <div className="py-8">
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Đang xử lý thanh toán...
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Vui lòng chờ trong giây lát
                      </p>
                    </div>
                  )}

                  {/* Payment Failed */}
                  {paymentStatus === 'failed' && (
                    <div className="py-8">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-red-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Thanh toán không thành công
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
                      </p>
                      <div className="flex gap-3">
                        <Button 
                          type="button"
                          variant="outline"
                          fullWidth
                          onClick={goBack}
                        >
                          Quay lại
                        </Button>
                        <Button 
                          type="button"
                          variant="primary"
                          fullWidth
                          onClick={() => handlePaymentMethodSelect(paymentMethod)}
                        >
                          Thử lại
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Payment Notice */}
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-left">
                        <p className="text-sm text-yellow-700 font-medium">Lưu ý quan trọng</p>
                        <p className="text-xs text-yellow-600 mt-1">
                          • Lịch hẹn chỉ được xác nhận sau khi thanh toán thành công<br />
                          • Với thanh toán MoMo, bạn sẽ được chuyển hướng đến trang thanh toán<br />
                          • Với thanh toán tiền mặt, vui lòng thanh toán khi đến phòng khám
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;