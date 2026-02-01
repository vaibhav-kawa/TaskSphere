package com.mit.tasksphere.TaskService.Services;

import com.mit.tasksphere.TaskService.Entities.Task;
import java.util.List;
import java.util.Map;

public interface TaskService {
    Task createTask(Task task);
    List<Task> getAllTasks(Long assignedTo, String status, String priority);
    Task getTaskById(Long id);
    Task updateTask(Long id, Task task);
    void deleteTask(Long id);
    Task reassignTask(Long id, String newAssignee);
    Task addComment(Long id, String comment);
    Map<String, Object> getAnalytics();
    List<Task> getReminders();
}
