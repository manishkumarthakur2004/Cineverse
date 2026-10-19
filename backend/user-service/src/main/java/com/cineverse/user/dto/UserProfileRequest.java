package com.cineverse.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserProfileRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    private String fullName;

    @Size(max = 500, message = "Profile image URL cannot exceed 500 characters")
    private String profileImage;
}
