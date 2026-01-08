package com.taskmanager.controller;

import com.taskmanager.dto.PageResponse;
import com.taskmanager.dto.TaskDTO;
import com.taskmanager.enums.TaskPriority;
import com.taskmanager.enums.TaskStatus;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskDTO.Response> createTask(
            @Valid @RequestBody TaskDTO.CreateRequest request) {
        TaskDTO.Response response = taskService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<PageResponse<TaskDTO.Response>> getAllTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(required = false) Long assignedToId) {
        PageResponse<TaskDTO.Response> response = taskService.getAllTasks(
                page, size, status, priority, assignedToId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO.Response> getTaskById(@PathVariable Long id) {
        TaskDTO.Response response = taskService.getTaskById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO.Response> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskDTO.UpdateRequest request) {
        TaskDTO.Response response = taskService.updateTask(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskDTO.Response> updateTaskStatus(
            @PathVariable Long id,
            @Valid @RequestBody TaskDTO.StatusUpdateRequest request) {
        TaskDTO.Response response = taskService.updateTaskStatus(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
