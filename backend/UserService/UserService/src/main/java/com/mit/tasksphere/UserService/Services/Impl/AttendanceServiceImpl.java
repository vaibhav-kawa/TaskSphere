package com.mit.tasksphere.UserService.Services.Impl;

import com.mit.tasksphere.UserService.Controller.AuthController;
import com.mit.tasksphere.UserService.Entities.Attendance;
import com.mit.tasksphere.UserService.Entities.User;
import com.mit.tasksphere.UserService.PayLoads.AttendanceResponse;
import com.mit.tasksphere.UserService.Repository.AttendanceRepository;
import com.mit.tasksphere.UserService.Repository.UserRepository;
import com.mit.tasksphere.UserService.Services.AttendanceService;

import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepo;

    @Autowired
    private UserRepository userRepo;
    
    private static final Logger logger = LoggerFactory.getLogger(AttendanceServiceImpl.class);

    @Override
    @Transactional
    public void logClockIn(User user) {
        LocalDate today = LocalDate.now();

        if (attendanceRepo.findByUserAndWorkDate(user, today).isEmpty()) {
            Attendance attendance = new Attendance();
            attendance.setUser(user);
            attendance.setWorkDate(today);
            attendance.setClockIn(LocalDateTime.now());

            attendanceRepo.save(attendance);
        }
    }

    @Override
    @Transactional
    public void logClockOut(User user) {
    	logger.info("Clocking out started for user : {}",user.getEmail());
        LocalDate today = LocalDate.now();
        attendanceRepo.findByUserAndWorkDate(user, today)
                .ifPresent(attendance -> {
                    attendance.setClockOut(LocalDateTime.now());
                    attendanceRepo.save(attendance);
                });
        logger.info("Clock out successful for user : {}",user.getEmail());
    }

    @Override
    public AttendanceResponse getTodayStatus(Long userId) {
    	
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return attendanceRepo.findByUserAndWorkDate(user, LocalDate.now())
                .map(att -> new AttendanceResponse(
                        att.getClockIn(),
                        att.getClockOut(),
                        att.getWorkDate()
                ))
                .orElse(null);
    }
}
