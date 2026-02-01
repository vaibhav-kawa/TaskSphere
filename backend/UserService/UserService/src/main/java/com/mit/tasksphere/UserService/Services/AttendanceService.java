package com.mit.tasksphere.UserService.Services;

import com.mit.tasksphere.UserService.Entities.User;
import com.mit.tasksphere.UserService.PayLoads.AttendanceResponse;

public interface AttendanceService {
    void logClockIn(User user);
    void logClockOut(User user);
    AttendanceResponse getTodayStatus(Long userId);
}