package com.taskmanager.service;

import com.taskmanager.dto.PageResponse;
import com.taskmanager.dto.TaskDTO;
import com.taskmanager.dto.UserDTO;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.enums.TaskPriority;
import com.taskmanager.enums.TaskStatus;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserService userService;

    @Transactional
    public TaskDTO.Response createTask(TaskDTO.CreateRequest request) {
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .build();

        if (request.getAssignedToId() != null) {
            User user = userService.findById(request.getAssignedToId());
            task.setAssignedTo(user);
        }

        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    @Transactional(readOnly = true)
    public PageResponse<TaskDTO.Response> getAllTasks(
            int page, int size, TaskStatus status,
            TaskPriority priority, Long assignedToId) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Task> taskPage = taskRepository.findAllWithFilters(
                status, priority, assignedToId, pageable);

        return PageResponse.<TaskDTO.Response>builder()
                .content(taskPage.getContent().stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList()))
                .pageNumber(taskPage.getNumber())
                .pageSize(taskPage.getSize())
                .totalElements(taskPage.getTotalElements())
                .totalPages(taskPage.getTotalPages())
                .first(taskPage.isFirst())
                .last(taskPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public TaskDTO.Response getTaskById(Long id) {
        Task task = findTaskById(id);
        return mapToResponse(task);
    }

    @Transactional
    public TaskDTO.Response updateTask(Long id, TaskDTO.UpdateRequest request) {
        Task task = findTaskById(id);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());

        if (request.getAssignedToId() != null) {
            User user = userService.findById(request.getAssignedToId());
            task.setAssignedTo(user);
        } else {
            task.setAssignedTo(null);
        }

        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }

    @Transactional
    public TaskDTO.Response updateTaskStatus(Long id, TaskDTO.StatusUpdateRequest request) {
        Task task = findTaskById(id);
        task.setStatus(request.getStatus());
        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }

    @Transactional
    public void deleteTask(Long id) {
        Task task = findTaskById(id);
        taskRepository.delete(task);
    }

    private Task findTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Task not found with id: " + id));
    }

    private TaskDTO.Response mapToResponse(Task task) {
        UserDTO.Response assignedToResponse = null;
        if (task.getAssignedTo() != null) {
            assignedToResponse = UserDTO.Response.builder()
                    .id(task.getAssignedTo().getId())
                    .name(task.getAssignedTo().getName())
                    .email(task.getAssignedTo().getEmail())
                    .build();
        }

        return TaskDTO.Response.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .assignedTo(assignedToResponse)
                .build();
    }
}
