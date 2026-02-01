package com.mit.tasksphere.UserService.Repository;

import com.mit.tasksphere.UserService.Entities.Attendance;
import com.mit.tasksphere.UserService.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByUserAndWorkDate(User user, LocalDate workDate);
}