import React from 'react';
import { Mail, Phone, MapPin, Globe, Heart } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-16 px-6 lg:px-20 mt-30">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 lg:p-12">
        <header className="flex items-start gap-4">
          <div className="flex-shrink-0 bg-blue-50 text-blue-600 rounded-full w-14 h-14 flex items-center justify-center">
            <Heart size={28} />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900">Về chúng tôi</h1>
            <p className="text-sm text-slate-500 mt-1">Trang đặt lịch khám đơn giản, nhanh — để sức khỏe không bị trì hoãn.</p>
          </div>
        </header>

        <main className="mt-8 space-y-8 text-slate-700">
          <section className="prose prose-slate max-w-none">
            <h2 className="text-xl font-semibold">Sứ mệnh</h2>
            <p>
              Chúng tôi xây dựng nền tảng đặt lịch khám trực tuyến nhỏ gọn, giúp bệnh nhân và cơ sở y tế
              quản lý cuộc hẹn dễ dàng hơn. Mục tiêu là giảm thời gian chờ, tăng tính minh bạch, và
              giúp người dùng tiếp cận dịch vụ y tế nhanh chóng.
            </p>

            <h2 className="text-xl font-semibold mt-4">Tính năng chính</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>Đặt lịch nhanh chóng — chọn ngày, giờ và nhận xác nhận.</li>
              <li>Thông báo nhắc lịch qua email (hoặc SMS nếu có tích hợp).</li>
              <li>Quản lý lịch đơn giản cho cơ sở y tế (bảng, thêm/sửa/xóa lịch).</li>
              <li>Giao diện nhẹ, load nhanh và tương thích mobile.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-4">Cam kết</h2>
            <p>
              Dữ liệu người dùng được bảo mật. Chúng tôi tôn trọng quyền riêng tư và chỉ sử dụng thông tin
              để phục vụ chức năng liên quan tới cuộc hẹn y tế. Nếu bạn có yêu cầu gỡ dữ liệu, vui lòng
              liên hệ để được hỗ trợ.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-slate-900">Cách dùng nhanh</h3>
              <ol className="mt-3 list-decimal ml-5 text-slate-700 space-y-2">
                <li>Chọn "Đặt lịch" ở trang chủ.</li>
                <li>Chọn ngày, giờ và nhập thông tin liên hệ.</li>
                <li>Nhận email xác nhận — đến đúng giờ, mang theo giấy tờ cần thiết.</li>
              </ol>
            </div>

            <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-sm">
              <h3 className="font-semibold text-lg text-slate-900">Liên hệ</h3>
              <p className="text-sm text-slate-600 mt-2">Nếu cần hỗ trợ hoặc muốn tích hợp API, liên hệ với chúng tôi:</p>

              <ul className="mt-4 space-y-3">
                <li className="flex items-center gap-3">
                  <Mail className="text-blue-600" size={18} />
                  <a className="text-sm text-slate-800 hover:underline" href="mailto:hello@datchoroi.vn">hello@datchoroi.vn</a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-blue-600" size={18} />
                  <a className="text-sm text-slate-800 hover:underline" href="tel:+84900123456">+84 900 123 456</a>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="text-blue-600" size={18} />
                  <span className="text-sm text-slate-800">Hà Nội, Việt Nam</span>
                </li>
                <li className="flex items-center gap-3">
                  <Globe className="text-blue-600" size={18} />
                  <a className="text-sm text-slate-800 hover:underline" href="/privacy">Chính sách & Quyền riêng tư</a>
                </li>
              </ul>

              <div className="mt-5">
                <a href="mailto:hello@datchoroi.vn" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm text-sm">Gửi email cho chúng tôi</a>
              </div>
            </div>
          </section>

          <section className="text-sm text-slate-500">
            <p><strong>Lưu ý:</strong> Đây là trang mô tả dịch vụ. Trang web không lưu trữ thông tin bác sĩ hoặc hồ sơ bệnh án công khai.</p>
          </section>
        </main>

        <footer className="mt-8 text-sm text-center text-slate-500">
          © {new Date().getFullYear()} Dắt Chỏ Rồi — Nền tảng đặt lịch khám đơn giản.
        </footer>
      </div>
    </div>
  );
}
