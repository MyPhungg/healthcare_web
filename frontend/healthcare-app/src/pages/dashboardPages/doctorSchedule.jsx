import React, { useState } from 'react';
import { Clock, Calendar, Plus, Trash2 } from 'lucide-react';
import Button from '../../components/common/button';

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState([
    { id: 1, day: 'Thứ 2', startTime: '08:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00' },
    { id: 2, day: 'Thứ 3', startTime: '08:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00' },
    { id: 3, day: 'Thứ 4', startTime: '08:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00' },
    { id: 4, day: 'Thứ 5', startTime: '08:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00' },
    { id: 5, day: 'Thứ 6', startTime: '08:00', endTime: '12:00', breakStart: null, breakEnd: null },
  ]);

  const handleDelete = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lịch làm việc</h1>
        <Button variant="primary">
          <Plus size={20} className="mr-2" />
          Thêm lịch làm việc
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left">Ngày</th>
              <th className="px-6 py-4 text-left">Giờ bắt đầu</th>
              <th className="px-6 py-4 text-left">Giờ kết thúc</th>
              <th className="px-6 py-4 text-left">Nghỉ trưa</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule, index) => (
              <tr key={schedule.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-6 py-4 font-semibold text-gray-800">{schedule.day}</td>
                <td className="px-6 py-4 text-gray-700">{schedule.startTime}</td>
                <td className="px-6 py-4 text-gray-700">{schedule.endTime}</td>
                <td className="px-6 py-4 text-gray-700">
                  {schedule.breakStart && schedule.breakEnd ? 
                    `${schedule.breakStart} - ${schedule.breakEnd}` : 
                    'Không có'
                  }
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm">
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(schedule.id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorSchedule;