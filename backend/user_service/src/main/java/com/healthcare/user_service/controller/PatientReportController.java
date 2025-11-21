package com.healthcare.user_service.controller;

import com.healthcare.user_service.entity.Patient;
import com.healthcare.user_service.service.PatientService;
import com.healthcare.user_service.service.ReportService;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JRException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class PatientReportController {

    private final ReportService reportService;
    private final PatientService patientService;

    @GetMapping("/patients")
    public ResponseEntity<byte[]> getPatientReport() throws JRException {
        List<Patient> patients = patientService.getAllPatients();
        byte[] pdf = reportService.generatePatientReport(patients);

        return ResponseEntity.ok()
                .header("Content-Disposition", "inline; filename=patients.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
