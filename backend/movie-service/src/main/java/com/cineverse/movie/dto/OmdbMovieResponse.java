package com.cineverse.movie.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class OmdbMovieResponse {

    @JsonProperty("Title")
    private String title;

    @JsonProperty("Year")
    private String year;

    @JsonProperty("Rated")
    private String rated;

    @JsonProperty("Released")
    private String released;

    @JsonProperty("Runtime")
    private String runtime;

    @JsonProperty("Genre")
    private String genre;

    @JsonProperty("Director")
    private String director;

    @JsonProperty("Writer")
    private String writer;

    @JsonProperty("Actors")
    private String actors;

    @JsonProperty("Plot")
    private String plot;

    @JsonProperty("Language")
    private String language;

    @JsonProperty("Country")
    private String country;

    @JsonProperty("Awards")
    private String awards;

    @JsonProperty("Poster")
    private String poster;

    @JsonProperty("BoxOffice")
    private String boxOffice;

    private String imdbRating;

    private String imdbVotes;

    @JsonProperty("imdbID")
    private String imdbId;

    @JsonProperty("Type")
    private String type;

    @JsonProperty("Response")
    private String response;

    @JsonProperty("Error")
    private String error;
}
