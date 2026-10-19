package com.cineverse.movie.controller;

import com.cineverse.common.dto.ApiResponse;
import com.cineverse.movie.dto.MovieResponse;
import com.cineverse.movie.service.MovieService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/movies")
@RequiredArgsConstructor
@Slf4j
public class MovieController {

    private final MovieService movieService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<MovieResponse>>> search(
            @RequestParam("query") String query,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "year", required = false) String year
    ) {
        log.info("API request to search movies for query: '{}', type: '{}', year: '{}'", query, type, year);
        List<MovieResponse> results = movieService.searchMovies(query, type, year);
        return ResponseEntity.ok(ApiResponse.success(results, "Search results retrieved successfully"));
    }

    @GetMapping("/details/{imdbId}")
    public ResponseEntity<ApiResponse<MovieResponse>> getDetails(@PathVariable("imdbId") String imdbId) {
        log.info("API request for movie details for IMDb ID: '{}'", imdbId);
        MovieResponse movie = movieService.getMovieDetails(imdbId);
        return ResponseEntity.ok(ApiResponse.success(movie, "Movie details retrieved successfully"));
    }
}
