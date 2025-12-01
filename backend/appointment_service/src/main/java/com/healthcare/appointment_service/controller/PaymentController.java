package com.healthcare.appointment_service.controller;

import com.healthcare.appointment_service.dto.*;
import com.healthcare.appointment_service.entity.Appointment;
import com.healthcare.appointment_service.common.AppointmentStatus;
import com.healthcare.appointment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/momo/create")
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequestDTO requestDTO) {
        try {
            PaymentResponseDTO response = paymentService.createPaymentForExistingAppointment(requestDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }



    @PostMapping("/momo/notify")
    public ResponseEntity<?> handleMomoNotify(@RequestBody MomoApiResponse response) {
        try {
            String appointmentId = response.getOrderId();
            AppointmentStatus status = (response.getResultCode() == 0)
                    ? AppointmentStatus.CONFIRMED
                    : AppointmentStatus.CANCELLED;


            paymentService.updateAppointmentStatus(appointmentId, status);

            return ResponseEntity.ok(Map.of(
                    "partnerCode", response.getPartnerCode(),
                    "orderId", response.getOrderId(),
                    "requestId", response.getRequestId(),
                    "amount", response.getAmount(),
                    "responseTime", System.currentTimeMillis(),
                    "message", "Success",
                    "resultCode", 0
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "resultCode", 1,
                    "message", "Failed"
            ));
        }
    }
    @PostMapping("/appointment/{appointmentId}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable String appointmentId) {
        try {
            // Hủy sau khi thanh toán → CANCELLED
            paymentService.updateAppointmentStatus(appointmentId, AppointmentStatus.CANCELLED);
            return ResponseEntity.ok(Map.of("status", "CANCELLED"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/appointment/{appointmentId}/status")
    public ResponseEntity<?> getAppointmentStatus(@PathVariable String appointmentId) {
        try {
            Appointment appointment = paymentService.getAppointmentStatus(appointmentId);
            return ResponseEntity.ok(Map.of(
                    "appointmentId", appointmentId,
                    "status", appointment.getStatus().toString(),
                    "patientId", appointment.getPatientId(),
                    "appointmentDate", appointment.getAppointmentDate(),
                    "appointmentTime", appointment.getAppointmentStart() + " - " + appointment.getAppointmentEnd()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}



//    @PostMapping("/momo/return")
//    public ResponseEntity<?> handleMomoReturn(@RequestBody MomoApiResponse response) {
//        try {
//            String appointmentId = response.getOrderId();
//            AppointmentStatus status = (response.getResultCode() == 0)
//                    ? AppointmentStatus.CONFIRMED
//                    : AppointmentStatus.CANCELLED;
//
//            paymentService.updateAppointmentStatus(appointmentId, status);
//
//            return ResponseEntity.ok(Map.of(
//                    "status", "success",
//                    "appointmentId", appointmentId,
//                    "message", "Cập nhật trạng thái thành công: " + status
//            ));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        }
//    }


















