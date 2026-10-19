package com.cineverse.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
    private Long id;
    private String username;
    private String email;
    private String imdbId;
    private String movieTitle;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
