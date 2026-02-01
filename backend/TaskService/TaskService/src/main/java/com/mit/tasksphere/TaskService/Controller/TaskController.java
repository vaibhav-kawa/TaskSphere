package com.mit.tasksphere.TaskService.Controller;


import com.mit.tasksphere.TaskService.Entities.Task;
import com.mit.tasksphere.TaskService.Services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
//@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping
    public Task createTask(@RequestBody Task task, HttpServletRequest request) {
        // SECURITY: Extract user ID from Gateway-validated headers only
        // NEVER parse JWT here - Gateway is the single source of truth
        String userId = request.getHeader("X-User-Id");
        
        // ARCHITECTURE: Headers are pre-validated by HeaderAuthenticationFilter
        // If we reach this point, user context is guaranteed to be valid
        
        // Set creator/assignee if not specified
        if (task.getAssignedTo() == null && userId != null) {
            task.setAssignedTo(Long.parseLong(userId));
        }
        
        return taskService.createTask(task);
    }

    @GetMapping
    public List<Task> getTasks(@RequestParam(required = false) Long assignedTo,
                               @RequestParam(required = false) String status,
                               @RequestParam(required = false) String priority,
                               HttpServletRequest request) {
        
        // If no assignedTo specified, filter by current user
        if (assignedTo == null) {
            String userId = request.getHeader("X-User-Id");
            if (userId != null) {
                assignedTo = Long.parseLong(userId);
            }
        }
        
        return taskService.getAllTasks(assignedTo, status, priority);
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        return taskService.updateTask(id, task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    @PutMapping("/{id}/reassign")
    public Task reassignTask(@PathVariable Long id, @RequestParam String newAssignee) {
        return taskService.reassignTask(id, newAssignee);
    }

    @PostMapping("/{id}/comment")
    public Task addComment(@PathVariable Long id, @RequestParam String comment) {
        return taskService.addComment(id, comment);
    }

    @GetMapping("/analytics")
    public Map<String, Object> getAnalytics() {
        return taskService.getAnalytics();
    }

    @GetMapping("/reminders")
    public List<Task> getReminders() {
        return taskService.getReminders();
    }
}
