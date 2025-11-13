import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Plus, Trash2, Edit3, Save, DollarSign, X } from 'lucide-react';
import Button from '../../components/common/button';

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    workingDays: [],
    startTime: '08:00',
    endTime: '17:00',
    consultationFee: '',
    slotDuration: 30,
  });

  const daysOfWeek = [
    { value: 'monday', label: 'Thứ 2' },
    { value: 'tuesday', label: 'Thứ 3' },
    { value: 'wednesday', label: 'Thứ 4' },
    { value: 'thursday', label: 'Thứ 5' },
    { value: 'friday', label: 'Thứ 6' },
    { value: 'saturday', label: 'Thứ 7' },
    { value: 'sunday', label: 'Chủ nhật' },
  ];

  const slotDurations = [
    { value: 15, label: '15 phút' },
    { value: 20, label: '20 phút' },
    { value: 30, label: '30 phút' },
    { value: 45, label: '45 phút' },
    { value: 60, label: '60 phút' },
  ];

  useEffect(() => {
    const mock = [
      {
        id: 1,
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        startTime: '08:00',
        endTime: '17:00',
        consultationFee: '300000',
        slotDuration: 30,
      },
    ];
    setSchedules(mock);
  }, []);

  const handleDayChange = (day) => {
    setFormData((prev) => {
      const updatedDays = prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day];
      return { ...prev, workingDays: updatedDays };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.workingDays.length === 0) {
      alert('Vui lòng chọn ít nhất một ngày làm việc');
      return;
    }
    if (!formData.consultationFee) {
      alert('Vui lòng nhập phí tư vấn');
      return;
    }

    if (isEditing) {
      setSchedules((prev) =>
        prev.map((item) => (item.id === editId ? { ...formData, id: editId } : item))
      );
      alert('Cập nhật lịch thành công!');
    } else {
      setSchedules((prev) => [
        ...prev,
        { ...formData, id: Date.now().toString() },
      ]);
      alert('Tạo lịch làm việc thành công!');
    }

    handleCloseForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa lịch này không?')) {
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleEdit = (schedule) => {
    setFormData(schedule);
    setIsEditing(true);
    setEditId(schedule.id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setFormData({
      workingDays: [],
      startTime: '08:00',
      endTime: '17:00',
      consultationFee: '',
      slotDuration: 30,
    });
  };

  const formatDays = (days) => {
    return days
      .map((day) => {
        const found = daysOfWeek.find((d) => d.value === day);
        return found ? found.label : day;
      })
      .join(', ');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Lịch làm việc bác sĩ</h1>
        <Button variant="primary" onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus size={20} /> Thêm lịch làm việc
        </Button>
      </div>

      {/* Bảng lịch làm việc */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left">Ngày làm việc</th>
              <th className="px-6 py-4 text-left">Giờ bắt đầu</th>
              <th className="px-6 py-4 text-left">Giờ kết thúc</th>
              <th className="px-6 py-4 text-left">Phí tư vấn</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule, i) => (
              <tr
                key={schedule.id}
                className={`border-b hover:bg-gray-50 ${
                  i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-6 py-4 text-gray-800">{formatDays(schedule.workingDays)}</td>
                <td className="px-6 py-4">{schedule.startTime}</td>
                <td className="px-6 py-4">{schedule.endTime}</td>
                <td className="px-6 py-4 text-green-700 font-semibold">
                  {formatCurrency(schedule.consultationFee)}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Chỉnh sửa"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {schedules.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Chưa có lịch làm việc nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form thêm / chỉnh sửa */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
            <button
              onClick={handleCloseForm}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditing ? 'Chỉnh sửa lịch làm việc' : 'Thêm lịch làm việc mới'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ngày làm việc trong tuần *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {daysOfWeek.map((day) => (
                    <label
                      key={day.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.workingDays.includes(day.value)}
                        onChange={() => handleDayChange(day.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ bắt đầu
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ kết thúc
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời lượng mỗi ca
                  </label>
                  <select
                    value={formData.slotDuration}
                    onChange={(e) =>
                      setFormData({ ...formData, slotDuration: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {slotDurations.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phí tư vấn (VNĐ)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.consultationFee}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        consultationFee: e.target.value.replace(/[^0-9]/g, ''),
                      })
                    }
                    placeholder="Nhập phí tư vấn"
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" className="flex items-center gap-2">
                  <Save size={18} />
                  {isEditing ? 'Cập nhật lịch' : 'Tạo lịch làm việc'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseForm}>
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;
