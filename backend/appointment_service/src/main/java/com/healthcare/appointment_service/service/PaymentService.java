package com.healthcare.appointment_service.service;

import com.healthcare.appointment_service.dto.*;
import com.healthcare.appointment_service.entity.Appointment;
import com.healthcare.appointment_service.entity.Schedule;
import com.healthcare.appointment_service.common.AppointmentStatus;
import com.healthcare.appointment_service.repository.AppointmentRepository;
import com.healthcare.appointment_service.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final AppointmentRepository appointmentRepository;
    private final ScheduleRepository scheduleRepository;
    private final MomoPaymentService momoPaymentService;

    @Transactional
    public PaymentResponseDTO createPaymentForExistingAppointment(PaymentRequestDTO requestDTO) {
        try {
            // 1. LẤY APPOINTMENT
            Appointment appointment = appointmentRepository.findById(requestDTO.getAppointmentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn: " + requestDTO.getAppointmentId()));

            if (appointment.getStatus() != AppointmentStatus.PENDING) {
                throw new RuntimeException("Lịch hẹn đã được xử lý: " + appointment.getStatus());
            }

            // 2. LẤY SCHEDULE ĐỂ LẤY PHÍ KHÁM
            Schedule schedule = scheduleRepository.findById(appointment.getScheduleId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch trình: " + appointment.getScheduleId()));

            if (schedule.getConsultationFee() == null || schedule.getConsultationFee().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Phí khám không hợp lệ: " + schedule.getConsultationFee());
            }

            // 3. TẠO MOMO PAYMENT - FIX FORMAT
            MomoApiRequest momoRequest = new MomoApiRequest();
            momoRequest.setPartnerCode(momoPaymentService.getPartnerCode());
            momoRequest.setPartnerName("Healthcare Web");
            momoRequest.setStoreId("healthcare_web");
            momoRequest.setRequestId(String.valueOf(System.currentTimeMillis()));
            // THÊM EXPIRE TIME (1 phút)
            momoRequest.setExpireTime(1 * 60 * 1000); // 1 phút = 1 * 60 * 1000 ms

            System.out.println("⏰ Set expire time: 1 phút");

            // QUAN TRỌNG: Amount phải là số nguyên (không có decimal)
            String amount = schedule.getConsultationFee().toBigInteger().toString();
            momoRequest.setAmount(amount);

            momoRequest.setOrderId(appointment.getAppointmentId());

            // OrderInfo không được có ký tự đặc biệt
            String orderInfo = "Thanh toan lich kham " + appointment.getAppointmentId();
            if (appointment.getReason() != null && !appointment.getReason().trim().isEmpty()) {
                orderInfo += " - " + appointment.getReason().replaceAll("[^a-zA-Z0-9\\s]", "");
            }
            momoRequest.setOrderInfo(orderInfo);


            momoRequest.setIpnUrl("http://localhost:8081/api/payment/momo/notify");
            momoRequest.setRedirectUrl("http://localhost:5173/payment/callback");
            //http://localhost:8081/api/payment/momo/return
            momoRequest.setExtraData(appointment.getAppointmentId());
            momoRequest.setRequestType("captureWallet");
            momoRequest.setLang("vi");

            System.out.println("=== PREPARING MOMO REQUEST ===");
            System.out.println("Amount: " + amount);
            System.out.println("OrderId: " + appointment.getAppointmentId());
            System.out.println("OrderInfo: " + orderInfo);

            // 4. GỌI MOMO TẠO THANH TOÁN
            MomoApiResponse momoResponse = momoPaymentService.createPayment(momoRequest);

            // 5. TRẢ VỀ KẾT QUẢ
            return PaymentResponseDTO.builder()
                    .paymentId(appointment.getAppointmentId())
                    .amount(schedule.getConsultationFee().longValue())
                    .method("MOMO")
                    .status("PENDING")
                    .payUrl(momoResponse.getPayUrl())
                    .qrCodeUrl(momoResponse.getQrCodeUrl())
                    .message("Tạo thanh toán thành công. Vui lòng thanh toán để xác nhận lịch hẹn.")
                    .appointmentId(appointment.getAppointmentId())
                    .build();

        } catch (Exception e) {
            System.err.println("=== PAYMENT SERVICE ERROR ===");
            e.printStackTrace();
            throw new RuntimeException("Lỗi tạo thanh toán: " + e.getMessage());
        }
    }

    @Transactional
    public void updateAppointmentStatus(String appointmentId, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn: " + appointmentId));

        appointment.setStatus(status);
        appointment.setInteractedAt(LocalDateTime.now());
        appointment.setInteractedBy("PAYMENT_SYSTEM");
        appointmentRepository.save(appointment);

        // CLEAR CACHE
        //appointmentRepository.flush();
        System.out.println(" Đã cập nhật lịch hẹn " + appointmentId + " -> " + status);
    }

    @Transactional(readOnly = true)
    public Appointment getAppointmentStatus(String appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn: " + appointmentId));
    }
}