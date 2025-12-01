package com.healthcare.appointment_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.appointment_service.dto.MomoApiRequest;
import com.healthcare.appointment_service.dto.MomoApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Formatter;

@Service
public class MomoPaymentService {

    @Value("${momo.endpoint:https://test-payment.momo.vn/v2/gateway/api/create}")
    private String momoEndpoint;

    @Value("${momo.secret-key}")
    private String secretKey;

    @Value("${momo.access-key}")
    private String accessKey;

    @Value("${momo.partner-code:MOMO}")
    private String partnerCode;

    public MomoApiResponse createPayment(MomoApiRequest request) {
        try {
            // SET CÁC FIELD BẮT BUỘC
            request.setPartnerCode(partnerCode);

            // Tạo chữ ký
            String signature = createSignature(request);
            request.setSignature(signature);

            // DEBUG REQUEST
            System.out.println("=== MOMO REQUEST DATA ===");
            System.out.println("PartnerCode: " + request.getPartnerCode());
            System.out.println("Amount: " + request.getAmount());
            System.out.println("OrderId: " + request.getOrderId());
            System.out.println("OrderInfo: " + request.getOrderInfo());
            System.out.println("Signature: " + signature);

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<MomoApiRequest> entity = new HttpEntity<>(request, headers);

            // DEBUG FULL REQUEST
            System.out.println("=== FULL MOMO REQUEST ===");
            ObjectMapper mapper = new ObjectMapper();
            String requestBody = mapper.writeValueAsString(request);
            System.out.println(requestBody);

            ResponseEntity<MomoApiResponse> response = restTemplate.exchange(
                    momoEndpoint,
                    HttpMethod.POST,
                    entity,
                    MomoApiResponse.class
            );

            System.out.println("=== MOMO RESPONSE ===");
            System.out.println(mapper.writeValueAsString(response.getBody()));

            return response.getBody();

        } catch (Exception e) {
            System.err.println("=== MOMO ERROR ===");
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi tạo thanh toán MoMo: " + e.getMessage());
        }
    }

    private String createSignature(MomoApiRequest request) throws Exception {
        // THỨ TỰ CHUẨN CỦA MOMO
        String rawHash = "accessKey=" + accessKey +
                "&amount=" + request.getAmount() +
                "&extraData=" + (request.getExtraData() != null ? request.getExtraData() : "") +
                "&ipnUrl=" + request.getIpnUrl() +
                "&orderId=" + request.getOrderId() +
                "&orderInfo=" + request.getOrderInfo() +
                "&partnerCode=" + request.getPartnerCode() +
                "&redirectUrl=" + request.getRedirectUrl() +
                "&requestId=" + request.getRequestId() +
                "&requestType=" + request.getRequestType();

        System.out.println("=== RAW SIGNATURE STRING ===");
        System.out.println(rawHash);

        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");
        sha256_HMAC.init(secret_key);

        String signature = toHexString(sha256_HMAC.doFinal(rawHash.getBytes()));
        System.out.println("Generated Signature: " + signature);

        return signature;
    }

    private String toHexString(byte[] bytes) {
        Formatter formatter = new Formatter();
        for (byte b : bytes) {
            formatter.format("%02x", b);
        }
        return formatter.toString();
    }

    public String getPartnerCode() {
        return partnerCode;
    }

    public String getAccessKey() {
        return accessKey;
    }
}