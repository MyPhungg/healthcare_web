import React from 'react';
import StatCard from '../../components/dashboard/statCard';
import { Users, UserCog, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react';

const Overview = () => {
  const stats = [
    { title: 'Tổng bệnh nhân', value: '2,543', icon: Users, color: 'blue', trend: { value: 12, isPositive: true } },
    { title: 'Tổng bác sĩ', value: '145', icon: UserCog, color: 'green', trend: { value: 5, isPositive: true } },
    { title: 'Lịch hẹn hôm nay', value: '87', icon: Calendar, color: 'orange', trend: { value: 8, isPositive: false } },
    { title: 'Doanh thu tháng', value: '450M', icon: DollarSign, color: 'purple', trend: { value: 15, isPositive: true } },
  ];

  const recentAppointments = [
    { id: 1, patient: 'Nguyễn Văn A', doctor: 'Dr. Trần B', time: '09:00 AM', status: 'confirmed' },
    { id: 2, patient: 'Lê Thị C', doctor: 'Dr. Phạm D', time: '10:30 AM', status: 'pending' },
    { id: 3, patient: 'Hoàng Văn E', doctor: 'Dr. Nguyễn F', time: '02:00 PM', status: 'completed' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Lịch hẹn gần đây</h2>
          <div className="space-y-3">
            {recentAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{apt.patient}</p>
                    <p className="text-sm text-gray-500">{apt.doctor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{apt.time}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center">
              <UserCog size={24} className="mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium text-gray-700">Thêm bác sĩ</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center">
              <Users size={24} className="mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium text-gray-700">Thêm bệnh nhân</p>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center">
              <Calendar size={24} className="mx-auto mb-2 text-orange-600" />
              <p className="text-sm font-medium text-gray-700">Đặt lịch hẹn</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center">
              <TrendingUp size={24} className="mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium text-gray-700">Xem báo cáo</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;