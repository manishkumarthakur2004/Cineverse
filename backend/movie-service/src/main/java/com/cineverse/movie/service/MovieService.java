package com.cineverse.movie.service;

import com.cineverse.movie.dto.MovieResponse;
import java.util.List;

public interface MovieService {
    List<MovieResponse> searchMovies(String query, String type, String year);
    MovieResponse getMovieDetails(String imdbId);
}
