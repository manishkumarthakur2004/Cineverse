package com.cineverse.movie.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class OmdbSearchResponse {

    @JsonProperty("Search")
    private List<OmdbMovieResponse> search;

    private String totalResults;

    @JsonProperty("Response")
    private String response;

    @JsonProperty("Error")
    private String error;
}
