package com.cineverse.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class WatchlistRequest {

    @NotBlank(message = "IMDb ID is required")
    private String imdbId;

    @NotBlank(message = "Movie title is required")
    private String title;

    private String poster;

    private String type;
}
