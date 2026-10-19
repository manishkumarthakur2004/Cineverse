package com.cineverse.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteResponse {
    private Long id;
    private String imdbId;
    private String title;
    private String poster;
    private String type;
}
