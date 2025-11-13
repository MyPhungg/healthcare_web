import React, {useState} from "react";
import InputComp from "../../components/common/inputComp";
import Button from "../../components/common/button";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock } from 'lucide-react';
import '../../index.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        accountType: 'patient', // patient or doctor
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Xử lý thay đổi input - ĐÃ SỬA: ĐÓNG HÀM ĐÚNG CHỖ
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error khi user nhập
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    }; // <- THÊM DẤU ĐÓNG HÀM Ở ĐÂY

    // Xử lý thay đổi loại tài khoản
    const handleAccountTypeChange = (type) => {
        setFormData(prev => ({
            ...prev,
            accountType: type
        }));
    };

    // Validation form
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.username.trim()) {
            newErrors.username = 'Tên tài khoản là bắt buộc';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Tên tài khoản phải có ít nhất 3 ký tự';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại phải có 10 chữ số';
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'Bạn phải đồng ý với điều khoản dịch vụ';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            // Gọi API đăng ký tài khoản
            const response = await fetch('http://localhost:8082/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    role: formData.accountType.toUpperCase() // SỬA: 'role' thay vì 'accountType'
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Đăng ký thành công:', data);
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
                navigate('/login');
            } else {
                console.error('Lỗi đăng ký:', data);
                setErrors({ submit: data.message || 'Đăng ký thất bại. Vui lòng thử lại sau.' });
            }
        } catch (error) {
            setErrors({ submit: 'Lỗi kết nối đến server' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-4xl font-bold mb-8 text-center text-blue-600">Đăng ký</h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="flex space-x-8 items-center">
                    {/* Tùy chọn 1: Bệnh nhân */}
                    <div className="flex items-center space-x-2">
                        <input 
                            type="radio" // SỬA: radio thay vì checkbox
                            name="accountType"
                            value="PATIENT" 
                            id="patient" 
                            checked={formData.accountType === 'PATIENT'} 
                            onChange={() => handleAccountTypeChange('PATIENT')}
                        />
                        <label htmlFor="patient" className="text-gray-700">Tôi là bệnh nhân</label>
                    </div>

                    {/* Tùy chọn 2: Bác sĩ */}
                    <div className="flex items-center space-x-2">
                        <input 
                            type="radio" // SỬA: radio thay vì checkbox
                            name="accountType"
                            value="DOCTOR" 
                            id="doctor" 
                            checked={formData.accountType === 'DOCTOR'} 
                            onChange={() => handleAccountTypeChange('DOCTOR')} 
                        />
                        <label htmlFor="doctor" className="text-gray-700">Tôi là bác sĩ</label>
                    </div>
                </div>

                <label className="text-gray-700 font-medium">Tên tài khoản</label>
                <InputComp
                    type="text"
                    name="username"
                    placeholder="Tên tài khoản"
                    value={formData.username}
                    onChange={handleInputChange}
                    error={errors.username}
                    className="mb-4"
                />
               
                <label className="text-gray-700 font-medium">Email</label>
                <InputComp
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    className="mb-4"
                />

                <label className="text-gray-700 font-medium">Số điện thoại</label>
                <InputComp
                    type="text"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                    className="mb-4"
                />

                <label className="text-gray-700 font-medium">Mật khẩu</label>
                <InputComp
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    className="mb-4"
                />

                <label className="text-gray-700 font-medium">Xác nhận mật khẩu</label>
                <InputComp
                    type="password"
                    name="confirmPassword"
                    placeholder="Xác nhận mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={errors.confirmPassword}
                    className="mb-4"
                />

                <div className="flex items-center space-x-2">
                    <input 
                        type="checkbox" 
                        id="agreeToTerms" 
                        name="agreeToTerms"
                        checked={formData.agreeToTerms} 
                        onChange={handleInputChange} 
                    />
                    <label htmlFor="agreeToTerms" className="text-gray-700">
                        Tôi đồng ý với <a href="#" className="text-blue-600 font-semibold hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-blue-600 font-semibold hover:underline">Chính sách bảo mật</a>.
                    </label>
                </div>
                {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}

                {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

                <div className="text-center">
                    <span className="text-gray-600">Đã có tài khoản? </span>
                    <Link to="/" className="text-blue-600 font-semibold hover:underline">
                        Đăng nhập ngay.
                    </Link>
                </div>

                <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
                    {isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
                </Button>
            </form>
        </div>
    );
}

export default Register;