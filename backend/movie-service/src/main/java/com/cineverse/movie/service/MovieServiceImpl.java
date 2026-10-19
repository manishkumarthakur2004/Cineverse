package com.cineverse.movie.service;

import com.cineverse.common.exception.BadRequestException;
import com.cineverse.common.exception.ResourceNotFoundException;
import com.cineverse.movie.dto.MovieResponse;
import com.cineverse.movie.dto.OmdbMovieResponse;
import com.cineverse.movie.dto.OmdbSearchResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MovieServiceImpl implements MovieService {

    private final RestClient restClient;

    @Value("${app.omdb.apikey}")
    private String apiKey;

    private static final String OMDB_BASE_URL = "https://www.omdbapi.com/";

    @Override
    public List<MovieResponse> searchMovies(String query, String type, String year) {
        log.info("Searching movies query: {}, type: {}, year: {}", query, type, year);

        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(OMDB_BASE_URL)
                .queryParam("apikey", apiKey)
                .queryParam("s", query);

        if (type != null && !type.trim().isEmpty()) {
            uriBuilder.queryParam("type", type);
        }
        if (year != null && !year.trim().isEmpty()) {
            uriBuilder.queryParam("y", year);
        }

        String url = uriBuilder.build().toUriString();

        try {
            OmdbSearchResponse response = restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(OmdbSearchResponse.class);

            if (response == null || "False".equalsIgnoreCase(response.getResponse())) {
                String errMsg = response != null ? response.getError() : "Unknown OMDb API error";
                log.warn("OMDb Search returned False: {}", errMsg);
                return Collections.emptyList();
            }

            return response.getSearch().stream()
                    .map(this::mapToMovieResponse)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error calling OMDb API: ", e);
            throw new BadRequestException("Failed to retrieve search results from OMDb API: " + e.getMessage());
        }
    }

    @Override
    public MovieResponse getMovieDetails(String imdbId) {
        log.info("Fetching details for IMDb ID: {}", imdbId);

        String url = UriComponentsBuilder.fromHttpUrl(OMDB_BASE_URL)
                .queryParam("apikey", apiKey)
                .queryParam("i", imdbId)
                .queryParam("plot", "full")
                .build()
                .toUriString();

        try {
            OmdbMovieResponse response = restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(OmdbMovieResponse.class);

            if (response == null || "False".equalsIgnoreCase(response.getResponse())) {
                String errMsg = response != null ? response.getError() : "Unknown OMDb API error";
                log.warn("OMDb Details returned False for ID {}: {}", imdbId, errMsg);
                throw new ResourceNotFoundException("Movie not found with IMDb ID: " + imdbId);
            }

            return mapToMovieResponse(response);

        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error calling OMDb API: ", e);
            throw new BadRequestException("Failed to retrieve movie details from OMDb API: " + e.getMessage());
        }
    }

    private MovieResponse mapToMovieResponse(OmdbMovieResponse omdb) {
        return MovieResponse.builder()
                .imdbId(omdb.getImdbId())
                .title(omdb.getTitle())
                .year(omdb.getYear())
                .poster(omdb.getPoster())
                .plot(omdb.getPlot())
                .genre(omdb.getGenre())
                .director(omdb.getDirector())
                .writer(omdb.getWriter())
                .actors(omdb.getActors())
                .language(omdb.getLanguage())
                .country(omdb.getCountry())
                .boxOffice(omdb.getBoxOffice())
                .imdbRating(omdb.getImdbRating())
                .imdbVotes(omdb.getImdbVotes())
                .rating(omdb.getImdbRating())
                .runtime(omdb.getRuntime())
                .type(omdb.getType())
                .build();
    }
}
