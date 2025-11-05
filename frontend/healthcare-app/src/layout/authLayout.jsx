import React from "react";
import { Outlet } from "react-router-dom";
import '../index.css'; // Đảm bảo file này đã cấu hình Tailwind

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex bg-blue-100">
            {/* Left Side - Image or Branding */}
            <div className="w-full flex items-center justify-center p-8 lg:w-1/2">
            <div className="w-full max-w-md p-8">
                <Outlet />
                </div>
            </div>

            {/* Right Side - Background Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 items-center justify-center">
            <div className="text-white text-center">
                <h1 className="text-5xl font-bold mb-5">Welcome to HealthcareVippro</h1>
                <p className="text-2xl font-light">Nơi sức khoẻ của bạn<br /> sẽ luôn được tôn trọng.</p>
            </div>
            </div>
        </div>

    );
}
export default AuthLayout;