package com.healthcare.appointment_service.service;

import com.healthcare.appointment_service.common.CodeGeneratorUtils;
import com.healthcare.appointment_service.common.DayOffStatus;
import com.healthcare.appointment_service.entity.DayOff;
import com.healthcare.appointment_service.repository.DayOffRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DayOffService {

    @Autowired
    public DayOffRepository dayOffRepository;

    public List<DayOff> getAllDayOffByDoctorIdAndStatus(String doctorId, DayOffStatus status){
        List<DayOff> list = dayOffRepository.findAllByDoctorIdAndStatus(doctorId, status);
        return list;
    }

    @Transactional
    public DayOff createDayOff(String doctorId,
                               LocalDate dateOff,
                               String reason,
                               String createdBy){
        DayOff exists = dayOffRepository.findByDoctorIdAndDateOff(doctorId, dateOff);
        if(exists != null){
            new RuntimeException("Ngày này đã được thiết lập là ngày nghỉ!");
        }
        DayOff dayOff = new DayOff();
        dayOff.setDayOffId(CodeGeneratorUtils.generateCode("dof"));
        dayOff.setDoctorId(doctorId);
        dayOff.setDateOff(dateOff);
        dayOff.setReason(reason);
        dayOff.setCreatedBy(createdBy);
        dayOffRepository.save(dayOff);
        return dayOff;
    }

    @Transactional
    public DayOff cancelDayOff(String dayOffId){
        DayOff dayOff = dayOffRepository.findById(dayOffId)
                .orElseThrow(()->new RuntimeException("Không tìm thấy ngày nghỉ!"));
        dayOff.setStatus(DayOffStatus.DISABLED);
        dayOffRepository.save(dayOff);
        return dayOff;
    }
}
