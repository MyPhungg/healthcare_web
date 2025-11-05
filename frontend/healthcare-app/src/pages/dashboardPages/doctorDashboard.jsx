import React from 'react';
import StatCard from '../../components/dashboard/statCard';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';

const DoctorDashboard = () => {
  const stats = [
    { title: 'Lịch hẹn hôm nay', value: '12', icon: Calendar, color: 'blue' },
    { title: 'Tổng bệnh nhân', value: '156', icon: Users, color: 'green' },
    { title: 'Giờ làm việc', value: '8h', icon: Clock, color: 'orange' },
    { title: 'Hoàn thành', value: '8', icon: CheckCircle, color: 'purple' },
  ];

  const todayAppointments = [
    { id: 1, patient: 'Nguyễn Văn A', time: '09:00', reason: 'Khám tổng quát', status: 'waiting' },
    { id: 2, patient: 'Trần Thị B', time: '09:30', reason: 'Tái khám', status: 'in-progress' },
    { id: 3, patient: 'Lê Văn C', time: '10:00', reason: 'Tư vấn', status: 'waiting' },
    { id: 4, patient: 'Phạm Thị D', time: '10:30', reason: 'Khám bệnh', status: 'scheduled' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Xin chào, Dr. Nguyễn Văn A</h1>
        <div className="text-right">
          <p className="text-sm text-gray-500">Hôm nay</p>
          <p className="text-lg font-semibold text-gray-800">
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Lịch hẹn hôm nay</h2>
        <div className="space-y-3">
          {todayAppointments.map((apt) => (
            <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all border-l-4 border-blue-500">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{apt.time.split(':')[0]}</p>
                  <p className="text-sm text-gray-500">{apt.time.split(':')[1]}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{apt.patient}</p>
                  <p className="text-sm text-gray-600">{apt.reason}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  apt.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                  apt.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {apt.status === 'waiting' ? 'Đang chờ' :
                   apt.status === 'in-progress' ? 'Đang khám' :
                   apt.status === 'completed' ? 'Hoàn thành' : 'Đã đặt'}
                </span>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;