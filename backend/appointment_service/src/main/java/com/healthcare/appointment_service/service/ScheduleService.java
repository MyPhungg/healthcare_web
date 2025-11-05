package com.healthcare.appointment_service.service;

import com.healthcare.appointment_service.common.CodeGeneratorUtils;
import com.healthcare.appointment_service.entity.Appointment;
import com.healthcare.appointment_service.entity.DayOff;
import com.healthcare.appointment_service.entity.Schedule;
import com.healthcare.appointment_service.repository.AppointmentRepository;
import com.healthcare.appointment_service.repository.DayOffRepository;
import com.healthcare.appointment_service.repository.ScheduleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private DayOffRepository dayOffRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    // lấy, thêm, sửa
    // Lấy lịch làm việc của bác sĩ

    public Schedule getScheduleByDoctorId(String doctorId){
        return scheduleRepository.findByDoctorId(doctorId);
    }

    // Lấy lịch cho bệnh nhân đăng ký
    public List<String> getAvailableSlots(String doctorId, LocalDate date){
        // Kiểm tra ngày nghỉ
        DayOff dayOff = dayOffRepository.findByDoctorIdAndDateOff(doctorId, date);
        if(dayOff != null){
            return Collections.emptyList(); //nghỉ
        }

        // Lấy lịch làm việc
        Schedule schedule = scheduleRepository.findByDoctorId(doctorId);
        String dayOfWeek = date.getDayOfWeek().name().substring(0,3);

        // Lấy lịch hẹn trong ngày
        List<Appointment> bookedAppointment = appointmentRepository.findByScheduleIdAndAppointmentDate(schedule.getScheduleId(), date);

        // Lấy list khung giờ đã chiếm
        Set<LocalTime> bookedTimes = bookedAppointment.stream()
                .map(a -> a.getAppointmentStart().toLocalTime())
                .collect(Collectors.toSet());

        // Sinh slot
        List<String> slots = new ArrayList<>();
        LocalTime start = schedule.getStartTime().toLocalTime();
        LocalTime end = schedule.getEndTime().toLocalTime();
        int duration = schedule.getSlotDuration();

        for(LocalTime t = start; t.plusMinutes(duration).isBefore(end) || t.plusMinutes(duration).equals(end); t = t.plusMinutes(duration)){
            LocalTime slotEnd = t.plusMinutes(duration);

            // Nếu slot chưa bị đặt
            if(!bookedTimes.contains(t)){
                slots.add(String.format("%s - %s", t, slotEnd));
            }
        }
        return slots;

    }
    // Tạo lịch làm việc cho bác sĩ
    @Transactional
    public Schedule createScheduleForDoctor(String doctorId,
                                            String workingDays,
                                            Time startTime,
                                            Time endTime,
                                            BigDecimal consultationFee,
                                            Integer slotDuration){
        Schedule exists = scheduleRepository.findByDoctorId(doctorId);
        if(exists != null){
            new RuntimeException("Bác sĩ này đã có lịch làm việc rồi!!!");
        }
        Schedule newSchedule = new Schedule();
        newSchedule.setScheduleId(CodeGeneratorUtils.generateCode("sch"));
        newSchedule.setDoctorId(doctorId);
        newSchedule.setWorkingDays(workingDays);
        newSchedule.setStartTime(startTime);
        newSchedule.setEndTime(endTime);
        newSchedule.setConsultationFee(consultationFee);
        newSchedule.setSlotDuration(slotDuration);
        scheduleRepository.save(newSchedule);
        return newSchedule;

    }

    // Sửa lịch làm việc cho bác sĩ
    @Transactional
    public Schedule changeSchedule(String scheduleId,
                                   String workingDays,
                                   Time startTime,
                                   Time endTime,
                                   BigDecimal consultationFee,
                                   Integer slotDuration){
        Schedule exists = scheduleRepository.findById(scheduleId)
                .orElseThrow(()->new RuntimeException("Không tìm thấy lịch làm việc này!"));
        exists.setWorkingDays(workingDays);
        exists.setStartTime(startTime);
        exists.setEndTime(endTime);
        exists.setConsultationFee(consultationFee);
        exists.setSlotDuration(slotDuration);
        scheduleRepository.save(exists);
        return exists;
    }


}
