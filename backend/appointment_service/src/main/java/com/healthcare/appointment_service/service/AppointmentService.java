package com.healthcare.appointment_service.service;

import com.healthcare.appointment_service.common.AppointmentStatus;
import com.healthcare.appointment_service.common.CodeGeneratorUtils;
import com.healthcare.appointment_service.dto.AppointmentInfo;
import com.healthcare.appointment_service.dto.NotificationEvent;
import com.healthcare.appointment_service.entity.Appointment;
import com.healthcare.appointment_service.entity.Schedule;
import com.healthcare.appointment_service.feign.DoctorClient;
import com.healthcare.appointment_service.feign.SpecialityClient;
import com.healthcare.appointment_service.feign.dto.PatientResponse;
import com.healthcare.appointment_service.feign.PatientClient;
import com.healthcare.appointment_service.feign.UserClient;
import com.healthcare.appointment_service.feign.dto.DoctorDTO;
import com.healthcare.appointment_service.feign.dto.SpecialityDTO;
import com.healthcare.appointment_service.feign.dto.UserResponse;
import com.healthcare.appointment_service.repository.AppointmentRepository;
import com.healthcare.appointment_service.repository.ScheduleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalDate;
import java.util.List;
@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final ScheduleRepository scheduleRepository;
    private final KafkaProducerService kafkaProducerService;
    private final DoctorClient doctorClient;
    private final UserClient userClient;
    private final PatientClient patientClient;
    private final SpecialityClient specialityClient;
    @Transactional
    public Appointment createAppointment(String scheduleId,
                                         String patientId,
                                         LocalDate appointmentDate,
                                         Time appointmentStart,
                                         Time appointmentEnd,
                                         String interactedBy,
                                         String reason) {
        // Sau này nếu cần xác thực thì chỉ thêm logic vào đây
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        String doctorId = schedule.getDoctorId();

        DoctorDTO doctor = doctorClient.getDoctorById(doctorId);
        if(doctor==null){
            throw new RuntimeException("Bác sĩ không tồn tại!");
        }

        // Kiểm tra xem có bị trùng lịch không
        // Trùng lịch chung bác sĩ
        boolean slotExists = appointmentRepository.existsByScheduleIdAndAppointmentDateAndAppointmentStartLessThanAndAppointmentEndGreaterThan(scheduleId, appointmentDate, appointmentStart, appointmentEnd);
        if(slotExists){
            throw new RuntimeException("Trùng lịch hẹn chung bác sĩ");
        }

        // Trùng lịch khác bác sĩ
        boolean slotExistsWithOtherDoctor = appointmentRepository.existsTimeSlotOverlap(patientId, appointmentDate, appointmentStart, appointmentEnd);
        if(slotExistsWithOtherDoctor){
            throw  new RuntimeException("Trùng lịch hẹn với bác sĩ khác");
        }


        Appointment app = new Appointment();
        app.setAppointmentId(CodeGeneratorUtils.generateCode("app"));
        app.setScheduleId(scheduleId);
        app.setPatientId(patientId);
        app.setAppointmentDate(appointmentDate);
        app.setAppointmentStart(appointmentStart);
        app.setAppointmentEnd(appointmentEnd);
        app.setInteractedBy(interactedBy);
        app.setReason(reason);
        appointmentRepository.save(app);

        PatientResponse patient = patientClient.getById(patientId).getBody();
        String userId = patient.getUser().getUserId();
//        UserResponse user = userClient.getUserById(userId);
        String userEmail = patient.getUser().getEmail();
        NotificationEvent event = new NotificationEvent(
                "APPOINTMENT_CREATED",
                "Cuộc hẹn mới đã được tạo thành công",
                userEmail,
                userId,
                app.getAppointmentId(),
                "SUCCESS"

        );

        kafkaProducerService.sendNotification(event);
        log.info("📤 Đã gửi Kafka event ở appointment service");
        System.out.println("📤 Đã gửi Kafka event ở appointment service: " + event);
        return app;
    }

    private void validateDoctorExists(String doctorId) {
        // Hiện tại chưa làm gì
        // Sau này có thể gọi sang doctor-service để kiểm tra ID
    }

    public List<Appointment> getAllAppointment(){
        return appointmentRepository.findAll();
    }

    @Transactional
    public Appointment cancelAppointment(String appId){
        Appointment oldApp = appointmentRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn muốn cancel"));
        oldApp.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(oldApp);

        PatientResponse patient = patientClient.getById(oldApp.getPatientId()).getBody();
        String userId = patient.getUser().getUserId();
//        UserResponse user = userClient.getUserById(userId);
        String userEmail = patient.getUser().getEmail();
        NotificationEvent event = new NotificationEvent(
                "APPOINTMENT_CANCELLED",
                "Cuộc hẹn đã được hủy thành công",
                userEmail,
                userId,
                oldApp.getAppointmentId(),
                "SUCCESS"

        );

        kafkaProducerService.sendNotification(event);
        log.info("📤 Đã gửi Kafka event ở appointment service");
        System.out.println("📤 Đã gửi Kafka event ở appointment service: " + event);
        return oldApp;
    }

    // Lấy list lịch hẹn của 1 bác sĩ (1 bác sĩ có 1 scheduleId)
    public List<Appointment> getAllAppointmentWithScheduleId(String scheduleId){
        return appointmentRepository.findByScheduleId(scheduleId);
    }

    // Lấy list lịch hẹn của bệnh nhân
    public List<Appointment> getAllAppointmentWithPatientId(String patientId){
        return appointmentRepository.findByPatientId(patientId);
    }

    public AppointmentInfo getAppointmentInfo(String appointmentId) {
        log.info("🔍 Getting appointment info for {}", appointmentId);

        // Lấy cuộc hẹn
        Appointment app = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc hẹn!"));
        String scheduleId = app.getScheduleId();
        log.info("📅 Found scheduleId: {}", scheduleId);

        // Lấy lịch của bác sĩ
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn"));
        String doctorId = schedule.getDoctorId();
        log.info("👨‍⚕️ Found doctorId: {}", doctorId);

        // Log trước khi gọi FeignClient
        log.info("📡 Calling doctorClient.getDoctorById({})", doctorId);
        DoctorDTO doctor = doctorClient.getDoctorById(doctorId);
        log.info("✅ Received doctor info: {}", doctor);

        SpecialityDTO speciality = specialityClient.getSpecialityById(doctor.getSpecialityId());

        // Tạo AppointmentInfo
        AppointmentInfo info = new AppointmentInfo(
                doctor.getFullName(),
                doctor.getAddress(),
                doctor.getDistrict(),
                doctor.getCity(),
                doctor.getClinicName(),
                speciality.getName(),
                app.getAppointmentDate(),
                app.getAppointmentStart(),
                app.getAppointmentEnd()
        );
        log.info("📦 Returning AppointmentInfo: {}", info);

        return info;
    }



//    @Transactional
//    public void deleteAppointment(String id){
//        appointmentRepository.deleteById(id);
//    }
}
