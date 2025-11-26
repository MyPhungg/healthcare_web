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
public class MedicalQueryRequest {
    private String message;
    private String userId;
    private String sessionId;

    @Builder.Default
    private LocalDateTime time = LocalDateTime.now();

    public MedicalQueryRequest(String message, String userId){
        this.message = message;
        this.userId = userId;
        this.time = LocalDateTime.now();
    }
}

