package com.mit.tasksphere.TaskService.Services.Impl;


import com.mit.tasksphere.TaskService.Entities.Task;
import com.mit.tasksphere.TaskService.Repository.TaskRepository;
import com.mit.tasksphere.TaskService.Services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepo;

    @Override
    public Task createTask(Task task) {
        task.setStatus("Pending");
        task.setProgress(0);
        return taskRepo.save(task);
    }

    @Override
    public List<Task> getAllTasks(Long assignedTo, String status, String priority) {
        if (assignedTo != null) return taskRepo.findByAssignedTo(assignedTo);
        if (status != null) return taskRepo.findByStatus(status);
        if (priority != null) return taskRepo.findByPriority(priority);
        return taskRepo.findAll();
    }

    @Override
    public Task getTaskById(Long id) {
        return taskRepo.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    @Override
    public Task updateTask(Long id, Task taskDetails) {
        Task task = getTaskById(id);
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setPriority(taskDetails.getPriority());
        task.setProgress(taskDetails.getProgress());
        task.setDeadline(taskDetails.getDeadline());
        return taskRepo.save(task);
    }

    @Override
    public void deleteTask(Long id) {
        taskRepo.deleteById(id);
    }

    @Override
    public Task reassignTask(Long id, String newAssignee) {
        Task task = getTaskById(id);
        task.setAssignedTo(Long.parseLong(newAssignee));
        return taskRepo.save(task);
    }

//    @Override
//    public Task addComment(Long id, String comment) {
//        Task task = getTaskById(id);
//        task.getComments().add(comment);
//        return taskRepo.save(task);
//    }

    @Override
    public Map<String, Object> getAnalytics() {
        List<Task> all = taskRepo.findAll();
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalTasks", all.size());
        analytics.put("completed", all.stream().filter(t -> "Completed".equals(t.getStatus())).count());
        analytics.put("pending", all.stream().filter(t -> "Pending".equals(t.getStatus())).count());
        analytics.put("inProgress", all.stream().filter(t -> "In Progress".equals(t.getStatus())).count());
        return analytics;
    }

    @Override
    public List<Task> getReminders() {
        LocalDate today = LocalDate.now();
        return taskRepo.findAll().stream()
                .filter(t -> t.getDeadline() != null && !t.getDeadline().isBefore(today))
                .toList();
    }

	@Override
	public Task addComment(Long id, String comment) {
		// TODO Auto-generated method stub
		return null;
	}
}
