package com.cineverse.user.controller;

import com.cineverse.common.dto.ApiResponse;
import com.cineverse.user.dto.FavoriteRequest;
import com.cineverse.user.dto.FavoriteResponse;
import com.cineverse.user.dto.ReviewRequest;
import com.cineverse.user.dto.ReviewResponse;
import com.cineverse.user.dto.UserProfileRequest;
import com.cineverse.user.dto.UserProfileResponse;
import com.cineverse.user.dto.WatchlistRequest;
import com.cineverse.user.dto.WatchlistResponse;
import com.cineverse.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    // Profile
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(
            @RequestHeader("X-User-Email") String email
    ) {
        log.info("API request to fetch profile for user: {}", email);
        UserProfileResponse response = userService.getProfile(email);
        return ResponseEntity.ok(ApiResponse.success(response, "Profile retrieved successfully"));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @RequestHeader("X-User-Email") String email,
            @Valid @RequestBody UserProfileRequest request
    ) {
        log.info("API request to update profile for user: {}", email);
        UserProfileResponse response = userService.updateProfile(email, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Profile updated successfully"));
    }

    // Favorites
    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getFavorites(
            @RequestHeader("X-User-Email") String email
    ) {
        log.info("API request to fetch favorites for user: {}", email);
        List<FavoriteResponse> response = userService.getFavorites(email);
        return ResponseEntity.ok(ApiResponse.success(response, "Favorites retrieved successfully"));
    }

    @PostMapping("/favorites")
    public ResponseEntity<ApiResponse<FavoriteResponse>> addFavorite(
            @RequestHeader("X-User-Email") String email,
            @Valid @RequestBody FavoriteRequest request
    ) {
        log.info("API request to add favorite for user: {}", email);
        FavoriteResponse response = userService.addFavorite(email, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Movie added to favorites"));
    }

    @DeleteMapping("/favorites/{imdbId}")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @RequestHeader("X-User-Email") String email,
            @PathVariable("imdbId") String imdbId
    ) {
        log.info("API request to remove favorite {} for user: {}", imdbId, email);
        userService.removeFavorite(email, imdbId);
        return ResponseEntity.ok(ApiResponse.success(null, "Movie removed from favorites"));
    }

    // Watchlist
    @GetMapping("/watchlist")
    public ResponseEntity<ApiResponse<List<WatchlistResponse>>> getWatchlist(
            @RequestHeader("X-User-Email") String email
    ) {
        log.info("API request to fetch watchlist for user: {}", email);
        List<WatchlistResponse> response = userService.getWatchlist(email);
        return ResponseEntity.ok(ApiResponse.success(response, "Watchlist retrieved successfully"));
    }

    @PostMapping("/watchlist")
    public ResponseEntity<ApiResponse<WatchlistResponse>> addToWatchlist(
            @RequestHeader("X-User-Email") String email,
            @Valid @RequestBody WatchlistRequest request
    ) {
        log.info("API request to add to watchlist for user: {}", email);
        WatchlistResponse response = userService.addToWatchlist(email, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Movie added to watchlist"));
    }

    @DeleteMapping("/watchlist/{imdbId}")
    public ResponseEntity<ApiResponse<Void>> removeFromWatchlist(
            @RequestHeader("X-User-Email") String email,
            @PathVariable("imdbId") String imdbId
    ) {
        log.info("API request to remove watchlist movie {} for user: {}", imdbId, email);
        userService.removeFromWatchlist(email, imdbId);
        return ResponseEntity.ok(ApiResponse.success(null, "Movie removed from watchlist"));
    }

    // Reviews & Ratings
    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMyReviews(
            @RequestHeader("X-User-Email") String email
    ) {
        log.info("API request to fetch reviews written by user: {}", email);
        List<ReviewResponse> response = userService.getReviewsByUser(email);
        return ResponseEntity.ok(ApiResponse.success(response, "User reviews retrieved successfully"));
    }

    @PostMapping("/reviews")
    public ResponseEntity<ApiResponse<ReviewResponse>> addOrUpdateReview(
            @RequestHeader("X-User-Email") String email,
            @Valid @RequestBody ReviewRequest request
    ) {
        log.info("API request to add/update review for user: {}", email);
        ReviewResponse response = userService.addOrUpdateReview(email, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Review saved successfully"));
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @RequestHeader("X-User-Email") String email,
            @PathVariable("reviewId") Long reviewId
    ) {
        log.info("API request to delete review ID {} for user: {}", reviewId, email);
        userService.deleteReview(email, reviewId);
        return ResponseEntity.ok(ApiResponse.success(null, "Review deleted successfully"));
    }

    @GetMapping("/reviews/movie/{imdbId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMovieReviews(
            @PathVariable("imdbId") String imdbId
    ) {
        log.info("API request to fetch reviews for movie IMDb ID: {}", imdbId);
        List<ReviewResponse> response = userService.getReviewsByMovie(imdbId);
        return ResponseEntity.ok(ApiResponse.success(response, "Movie reviews retrieved successfully"));
    }
}
