import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">HealthCareVippro</h3>
            <p className="text-sm mb-4">
              Nơi sức khỏe của bạn sẽ luôn được tôn trọng.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-pink-500 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">Về chúng tôi</Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-white transition-colors">Bác sĩ</Link>
              </li>
              <li>
                <Link to="/specialties" className="hover:text-white transition-colors">Chuyên khoa</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Dịch vụ</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/booking" className="hover:text-white transition-colors">Đặt lịch khám</Link>
              </li>
              <li>
                <Link to="/consultation" className="hover:text-white transition-colors">Tư vấn trực tuyến</Link>
              </li>
              <li>
                <Link to="/health-check" className="hover:text-white transition-colors">Khám sức khỏe</Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:text-white transition-colors">Cấp cứu</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span className="text-sm">123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <span className="text-sm">1900 1234</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <span className="text-sm">info@healthcarevippro.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 HealthCareVippro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;