package com.cineverse.movie.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieResponse {
    private String imdbId;
    private String title;
    private String year;
    private String poster;
    private String plot;
    private String genre;
    private String director;
    private String writer;
    private String actors;
    private String language;
    private String country;
    private String boxOffice;
    private String imdbRating;
    private String imdbVotes;
    private String rating;
    private String runtime;
    private String type;
}
