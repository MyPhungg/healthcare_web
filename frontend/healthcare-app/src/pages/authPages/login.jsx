import React, {useState} from "react";
import { Outlet } from "react-router-dom";
import InputComp from "../../components/common/inputComp";
import Button from "../../components/common/button";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock } from 'lucide-react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import '../../index.css';
const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault(); 
        console.log("Form Data Submitted: ", formData);
        Navigate("/dashboard");
    }
    return (
      <div className="w-full ">
      <h2 className="text-4xl font-bold mb-8 text-center text-blue-600">Đăng nhập</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="text-gray-700 font-medium" icon={User}>Tên tài khoản</label>
        <InputComp
          type="text"
          name="username"
          placeholder="Tên tài khoản"
          value={formData.username}
          onChange={handleChange}
          className="mb-4"
        />
        <label className="text-gray-700 font-medium" icon={Lock}>Mật khẩu</label>
        <InputComp
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          className="mb-4"
        />

        <div className="text-center">
          <span className="text-gray-600">Chưa có tài khoản? </span>
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Đăng ký ngay.
          </Link>
        </div>

        <Button type="submit" variant="primary" fullWidth>
          Đăng nhập
        </Button>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="space-y-3">
          <Button
            variant="outline"
            fullWidth
            icon={FaFacebook}
            onClick={() => handleSocialLogin('facebook')}
          >
            Tiếp tục với Facebook
          </Button>

          <Button
            variant="outline"
            fullWidth
            icon={FaGoogle}
            onClick={() => handleSocialLogin('google')}
          >
            Tiếp tục với Google
          </Button>
        </div>
      </div>
    </div>
    );
}
export default Login;