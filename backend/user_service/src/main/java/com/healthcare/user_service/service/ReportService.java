package com.healthcare.user_service.service;

import com.healthcare.user_service.entity.Patient;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    public byte[] generatePatientReport(List<Patient> patients) throws JRException {
        JasperReport jasperReport = JasperCompileManager.compileReport(
                getClass().getResourceAsStream("/reports/patient_report.jrxml")
        );

        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(patients);
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("createdBy", "Healthcare System");

        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

        return JasperExportManager.exportReportToPdf(jasperPrint);
    }
}
