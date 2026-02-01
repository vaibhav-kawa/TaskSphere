package com.mit.tasksphere.TaskService.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.mit.tasksphere.TaskService.Entities.Task;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedTo(Long assignedTo);
    List<Task> findByStatus(String status);
    List<Task> findByPriority(String priority);
}
