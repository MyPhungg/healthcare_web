import React, {useState} from "react";
import InputComp from "../../components/common/inputComp";
import Button from "../../components/common/button";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, Mail, Phone } from 'lucide-react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import AuthService from '../../service/authService';
import '../../index.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        emailOrPhone: "",
        password: ""
    });
    
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Clear error khi user bắt đầu nhập
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        if (errors.submit) {
            setErrors(prev => ({
                ...prev,
                submit: ''
            }));
        }
    }

    // Validation form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.emailOrPhone.trim()) {
            newErrors.emailOrPhone = 'Email hoặc số điện thoại là bắt buộc';
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
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
            // Sử dụng AuthService để đăng nhập
            const result = await AuthService.login({
                emailOrPhone: formData.emailOrPhone,
                password: formData.password
            });

            console.log('Đăng nhập thành công:', result);
            
            // Lưu thông tin user và token
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            localStorage.setItem('userRole', result.user.role);
             // Kiểm tra nếu là bác sĩ và chưa có profile
            if (result.user.role === 'DOCTOR') {
            try {
                const hasProfile = await AuthService.checkDoctorProfileExists(result.user.userId);
                if (!hasProfile) {
                // Chưa có profile, chuyển đến trang đăng ký
                console.log('Bác sĩ chưa có profile, chuyển đến trang đăng ký');
                navigate('/doctor-register');
                return;
                }
            } catch (profileError) {
                console.log('Không thể kiểm tra profile bác sĩ, chuyển đến trang đăng ký');
                navigate('/doctor-register');
                return;
            }
            }
            // Chuyển hướng theo role
            const redirectPath = AuthService.getRedirectPathByRole(result.user.role);
            console.log(`Chuyển hướng đến: ${redirectPath} với role: ${result.user.role}`);
            navigate(redirectPath);
            
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            setErrors({ submit: error.message || 'Đăng nhập thất bại' });
        } finally {
            setIsLoading(false);
        }
    }

    const handleSocialLogin = async (provider) => {
        try {
            // Redirect đến OAuth2 provider hoặc mở popup
            if (provider === 'google') {
                window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=http://localhost:3000/auth/callback&response_type=token&scope=email profile`;
            } else if (provider === 'facebook') {
                window.location.href = `https://www.facebook.com/v12.0/dialog/oauth?client_id=YOUR_FACEBOOK_APP_ID&redirect_uri=http://localhost:3000/auth/callback&scope=email`;
            }
        } catch (error) {
            console.error('Lỗi đăng nhập mạng xã hội:', error);
            setErrors({ submit: `Lỗi đăng nhập với ${provider}` });
        }
    }

    const handleForgotPassword = () => {
        navigate("/forgot-password");
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Đăng nhập</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email hoặc số điện thoại */}
                <InputComp
                    label="Email hoặc số điện thoại"
                    type="text"
                    name="emailOrPhone"
                    placeholder="Nhập email hoặc số điện thoại"
                    value={formData.emailOrPhone}
                    onChange={handleChange}
                    error={errors.emailOrPhone}
                    icon={Mail}
                />

                {/* Mật khẩu */}
                <InputComp
                    label="Mật khẩu"
                    type="password"
                    name="password"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    icon={Lock}
                />

                {/* Quên mật khẩu */}
                <div className="text-right">
                    <button 
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-blue-600 text-sm font-medium hover:underline"
                    >
                        Quên mật khẩu?
                    </button>
                </div>

                {/* Lỗi submit */}
                {errors.submit && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                        {errors.submit}
                    </div>
                )}

                {/* Đăng ký tài khoản mới */}
                <div className="text-center pt-2">
                    <span className="text-gray-600">Chưa có tài khoản? </span>
                    <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                        Đăng ký ngay.
                    </Link>
                </div>

                {/* Nút đăng nhập */}
                <Button 
                    type="submit" 
                    variant="primary" 
                    fullWidth
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
            </form>

            {/* Đăng nhập bằng mạng xã hội */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600 mb-4">Hoặc tiếp tục với</p>
                <div className="space-y-3">
                    <Button
                        variant="outline"
                        fullWidth
                        icon={FaFacebook}
                        onClick={() => handleSocialLogin('facebook')}
                        className="flex items-center justify-center gap-2"
                    >
                        Tiếp tục với Facebook
                    </Button>

                    <Button
                        variant="outline"
                        fullWidth
                        icon={FaGoogle}
                        onClick={() => handleSocialLogin('google')}
                        className="flex items-center justify-center gap-2"
                    >
                        Tiếp tục với Google
                    </Button>
                </div>
            </div>

            {/* Demo credentials (chỉ cho môi trường development) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Demo credentials:</p>
                    <p className="text-xs text-gray-500">Email: patient1@example.com</p>
                    <p className="text-xs text-gray-500">Phone: 0912345678</p>
                    <p className="text-xs text-gray-500">Password: password123</p>
                </div>
            )}
        </div>
    );
}

export default Login;