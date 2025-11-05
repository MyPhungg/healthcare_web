import React, {useState} from "react";
import { Outlet } from "react-router-dom";
import InputComp from "../../components/common/inputComp";
import Button from "../../components/common/button";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock } from 'lucide-react';

import '../../index.css';
const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
    accountType: 'patient', // patient or doctor
    gender: 'male',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
    return (
        <div className="w-full ">
        <h2 className="text-4xl font-bold mb-8 text-center text-blue-600">Đăng ký</h2>

        <form className="space-y-5">
           <div className="flex space-x-8 items-center">
                {/* Tùy chọn 1: Bệnh nhân */}
                <div className="flex items-center space-x-2">
                    <input type="checkbox" value="patient" id="patient" />
                    <label htmlFor="patient" className="text-gray-700">Tôi là bệnh nhân</label>
                </div>

                {/* Tùy chọn 2: Bác sĩ */}
                <div className="flex items-center space-x-2">
                    <input type="checkbox" value="doctor" id="doctor" />
                    <label htmlFor="doctor" className="text-gray-700">Tôi là bác sĩ</label>
                </div>
            </div>
            <label className="text-gray-700 font-medium" icon={User}>Tên tài khoản</label>
            <InputComp
            type="text"
            name="username"
            placeholder="Tên tài khoản"
            value={formData.username}
            className="mb-4"
            />
            <div className="flex space-x-8 items-center">
                <div className="flex items-center space-x-2">
                    <input type="checkbox" value="gender-male" id="male" />
                    <label htmlFor="patient" className="text-gray-700">Nam</label>
                </div>
                <div className="flex items-center space-x-2">
                    <input type="checkbox" value="gender-female" id="female" />
                    <label htmlFor="doctor" className="text-gray-700">Nữ</label>
                </div>
            </div>
            <label className="text-gray-700 font-medium" icon={User}>Email</label>
            <InputComp
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            className="mb-4"
            />
            <label className="text-gray-700 font-medium" icon={User}>Số điện thoại</label>
            <InputComp
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            className="mb-4"
            />
            <label className="text-gray-700 font-medium" icon={Lock}>Mật khẩu</label>
            <InputComp
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            className="mb-4"
            />
            <label className="text-gray-700 font-medium" icon={Lock}>Xác nhận mật khẩu</label>
            <InputComp
            type="password"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            value={formData.confirmPassword}
            className="mb-4"
            />
            <div className="flex items-center space-x-2">
                <input type="checkbox" id="agreeToTerms" />
                <label htmlFor="agreeToTerms" className="text-gray-700">
                    Tôi đồng ý với <a href="#" className="text-blue-600 font-semibold hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-blue-600 font-semibold hover:underline">Chính sách bảo mật</a>.
                </label>
            </div>
            <div className="text-center">
                <span className="text-gray-600">Đã có tài khoản? </span>
                <Link to="/" className="text-blue-600 font-semibold hover:underline">
                    Đăng nhập ngay.
                </Link>
                </div>

                <Button type="submit" variant="primary" fullWidth>
                Đăng Ký
                </Button>

        </form>
        </div>

    );
}
export default Register;