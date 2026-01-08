package com.taskmanager.dto;

import com.taskmanager.enums.TaskPriority;
import com.taskmanager.enums.TaskStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
        private String title;

        @Size(max = 500, message = "Description must not exceed 500 characters")
        private String description;

        @NotNull(message = "Status is required")
        private TaskStatus status;

        @NotNull(message = "Priority is required")
        private TaskPriority priority;

        private LocalDate dueDate;

        private Long assignedToId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
        private String title;

        @Size(max = 500, message = "Description must not exceed 500 characters")
        private String description;

        @NotNull(message = "Status is required")
        private TaskStatus status;

        @NotNull(message = "Priority is required")
        private TaskPriority priority;

        private LocalDate dueDate;

        private Long assignedToId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StatusUpdateRequest {
        @NotNull(message = "Status is required")
        private TaskStatus status;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private TaskStatus status;
        private TaskPriority priority;
        private LocalDate dueDate;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private UserDTO.Response assignedTo;
    }
}
