package com.healthcare.chatbot_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalChatResponse {
    private String response;
    private MedicalContext context;
    private ResponseType type;
    private LocalDateTime time;

    public static MedicalChatResponse success(String response, MedicalContext context){
        MedicalChatResponse res = new MedicalChatResponse();
        res.setResponse(response);
        res.setContext(context);
        res.setType(ResponseType.SUCCESS);
        res.setTime(LocalDateTime.now());
        return res;
    }

    public static MedicalChatResponse error(String error){
        MedicalChatResponse res = new MedicalChatResponse();
        res.setResponse("Xin lỗi: "+error);
        res.setType(ResponseType.ERROR);
        res.setTime(LocalDateTime.now());
        return res;
    }
}
