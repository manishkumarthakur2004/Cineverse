package com.cineverse.user.service;

import com.cineverse.user.dto.FavoriteRequest;
import com.cineverse.user.dto.FavoriteResponse;
import com.cineverse.user.dto.ReviewRequest;
import com.cineverse.user.dto.ReviewResponse;
import com.cineverse.user.dto.UserProfileRequest;
import com.cineverse.user.dto.UserProfileResponse;
import com.cineverse.user.dto.WatchlistRequest;
import com.cineverse.user.dto.WatchlistResponse;

import java.util.List;

public interface UserService {
    // User Profile
    UserProfileResponse getProfile(String email);
    UserProfileResponse updateProfile(String email, UserProfileRequest request);

    // Favorites
    FavoriteResponse addFavorite(String email, FavoriteRequest request);
    void removeFavorite(String email, String imdbId);
    List<FavoriteResponse> getFavorites(String email);

    // Watchlist
    WatchlistResponse addToWatchlist(String email, WatchlistRequest request);
    void removeFromWatchlist(String email, String imdbId);
    List<WatchlistResponse> getWatchlist(String email);

    // Reviews & Ratings
    ReviewResponse addOrUpdateReview(String email, ReviewRequest request);
    void deleteReview(String email, Long reviewId);
    List<ReviewResponse> getReviewsByUser(String email);
    List<ReviewResponse> getReviewsByMovie(String imdbId);
}
