package com.mit.tasksphere.UserService.PayLoads;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
public class AttendanceResponse {
    private LocalDateTime clockIn;
    private LocalDateTime clockOut;
    private LocalDate workDate;
	public AttendanceResponse(LocalDateTime clockIn, LocalDateTime clockOut, LocalDate workDate) {
		super();
		this.clockIn = clockIn;
		this.clockOut = clockOut;
		this.workDate = workDate;
	}
    
    
}