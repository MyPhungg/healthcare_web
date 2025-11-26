package com.healthcare.chatbot_service.service;

import com.healthcare.chatbot_service.dto.MedicalChatResponse;
import com.healthcare.chatbot_service.dto.MedicalContext;
import com.healthcare.chatbot_service.dto.MedicalIntent;
import com.healthcare.chatbot_service.dto.MedicalQueryRequest;
import com.healthcare.chatbot_service.feign.AppointmentServiceClient;
import com.healthcare.chatbot_service.feign.NotificationServiceClient;
import com.healthcare.chatbot_service.feign.UserServiceClient;
import com.healthcare.chatbot_service.feign.dto.AppointmentDTO;
import com.healthcare.chatbot_service.feign.dto.PatientResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
@Slf4j
public class MedicalChatbotService {
    private final UserServiceClient userServiceClient;
    private final AppointmentServiceClient appointmentServiceClient;
    private final NotificationServiceClient notificationServiceClient;
    private final ChatClient chatClient;

    public MedicalChatResponse processQuery(MedicalQueryRequest request){
        log.info("Truy vấn từ người dùng: {}", request.getUserId());
        try {
            // 1. Phân tích INTENT: hiểu người dùng muốn gì
            MedicalIntent intent = analyzeIntent(request.getMessage());
            log.info("Intent là: {}", intent);

            // 2. Thu thập dữ liệu từ các service
            MedicalContext context = gatherContext(intent, request.getUserId());

            // 3. Tạo prompt
            String prompt = createPrompt(request.getMessage(), intent, context);

            // 4. Gọi AI model
            String aiResponse = callGemini(prompt);

            // 5. Trả kết quả
            return MedicalChatResponse.success(aiResponse, context);
        } catch (Exception e){
            log.error("Error: {}", e.getMessage());
            return MedicalChatResponse.error(e.getMessage());
        }
    }

    private MedicalIntent analyzeIntent(String message){
        String lowerMessage = message.toLowerCase().trim();
        Map<MedicalIntent, List<String>> keywordMap = Map.of(
                // Đặt lịch
                MedicalIntent.BOOK_APPOINTMENT, Arrays.asList(
                        "đặt lịch", "đăng ký lịch", "book appointment", "tạo lịch hẹn",
                        "muốn khám", "cần khám", "đặt hẹn", "schedule appointment"
                ),

                // Xem lịch đã hẹn
                MedicalIntent.VIEW_APPOINMENTS, Arrays.asList(
                        "lịch hẹn", "appointment", "cuộc hẹn", "lịch khám",
                        "xem lịch", "kiểm tra lịch", "lịch của tôi"
                ),

                // Khung giờ làm việc của bác sĩ
                MedicalIntent.DOCTOR_SCHEDULE, Arrays.asList(
                  "khung giờ", "lịch làm", "giờ làm", "schedule",
                  "bác sĩ làm giờ nào", "giờ khám", "thời gian làm việc"
                ),

                // Hủy hẹn
                MedicalIntent.CANCEL_APPOINTMENT, Arrays.asList(
                        "hủy lịch", "cancel", "xóa lịch", "hủy hẹn",
                        "không đi được", "đổi lịch", "dời lịch"
                ),

                // Tư vấn y khoa
                MedicalIntent.MEDICAL_ADVICE, Arrays.asList(
                        "triệu chứng", "bệnh", "đau", "sốt", "ho", "cảm",
                        "nhức đầu", "mệt mỏi", "tư vấn sức khỏe", "có nên khám",
                        "dấu hiệu", "biểu hiện"
                ),

                // Thông tin bác sĩ
                MedicalIntent.DOCTOR_INFO, Arrays.asList(
                        "bác sĩ", "doctor", "bs", "bác sỹ", "tìm bác sĩ",
                        "bác sĩ giỏi", "chuyên gia", "bác sĩ khoa"
                ),

                // Thông tin chuyên khoa
                MedicalIntent.SPECIALITY_INFO, Arrays.asList(
                        "chuyên khoa", "khoa", "chuyên môn"
                )
        );

        // Tìm intent phù hợp
        for(Map.Entry<MedicalIntent, List<String>> entry : keywordMap.entrySet()){
            if(entry.getValue().stream().anyMatch(lowerMessage::contains)){
                return entry.getKey();
            }
        }

        // Nếu không tìm thấy intent phù hợp --> ngoài phạm vi
        return MedicalIntent.OUT_OF_SCOPE;
    }

    private MedicalContext gatherContext(MedicalIntent intent, String userId){
        MedicalContext context = new MedicalContext();
        try{
            if(userId != null){
                gatherPatientContext(context, userId);
            }
            switch (intent){
                case BOOK_APPOINTMENT:
                    // Cho đặt lịch: cần danh sách bác sĩ, chuyên khoa, khung giờ
                    gatherDoctorContext(context);
                    gatherSpecialityContext(context);
                    break;
                case VIEW_APPOINMENTS:
                    // Cho xem lịch: cần lịch hẹn của bệnh nhân
                    if(context.getCurrentPatient() != null){
                        gatherAppointmentContext(context, context.getCurrentPatient().getPatientId());
                    }
                    break;
                case DOCTOR_SCHEDULE:
                    // Cho khung giờ: cần thông tin bác sĩ và lịch làm việc
                    gatherDoctorContext(context);
                    break;
                case CANCEL_APPOINTMENT:
                    // Cho hủy lịch: cần lịch hiện tại
                    if(context.getCurrentPatient() != null){
                        gatherAppointmentContext(context, context.getCurrentPatient().getPatientId());
                    }
                    break;
                case MEDICAL_ADVICE:
                    // Cho tư vấn: cần thông tin chuyên khoa để gợi ý
                    gatherSpecialityContext(context);
                    break;
                case DOCTOR_INFO:
                case SPECIALITY_INFO:
                    // Cho thông tin: Cần danh sách bác sĩ và chuyên khoa
                    gatherDoctorContext(context);
                    gatherSpecialityContext(context);
                    break;
                case OUT_OF_SCOPE:
                    break;
            }
        } catch (Exception e){
            log.warn("lỗi lấy context: {} ", e.getMessage());
        }
        return context;
    }

    private void gatherPatientContext(MedicalContext context, String userId) { //
        try {
            PatientResponse patient = userServiceClient.getById(userId);
            if(patient != null){

            }
                context.setCurrentPatient(patient);
        } catch (Exception e){
            log.warn("Không thể lấy data patient: {}", e.getMessage());
        }
    }

    private void gatherAppointmentContext(MedicalContext context, String userId){ // là patientID nhưng chưa có hàm nên gắn đỡ
        try{
            // Lấy thông tin patient
            PatientResponse patient = userServiceClient.getById(userId);
            if(patient != null){
                context.setCurrentPatient(patient);
                List<AppointmentDTO> appointments = appointmentServiceClient.getAllAppointmentWithPatientId(userId);
                context.setAppointments(appointments);
            }
        } catch (Exception e){
            log.warn("Không thể lấy data appointments: {}", e.getMessage());
        }
    }
}
