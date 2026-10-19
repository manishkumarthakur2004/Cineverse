package com.cineverse.user.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReviewRequest {

    @NotBlank(message = "IMDb ID is required")
    private String imdbId;

    @NotBlank(message = "Movie title is required")
    private String movieTitle;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 10, message = "Rating cannot exceed 10")
    private Integer rating;

    @NotBlank(message = "Comment is required")
    @Size(max = 1000, message = "Comment cannot exceed 1000 characters")
    private String comment;
}
