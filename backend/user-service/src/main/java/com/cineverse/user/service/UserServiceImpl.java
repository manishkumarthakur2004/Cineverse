package com.cineverse.user.service;

import com.cineverse.common.exception.BadRequestException;
import com.cineverse.common.exception.ResourceNotFoundException;
import com.cineverse.common.exception.UnauthorizedException;
import com.cineverse.user.dto.FavoriteRequest;
import com.cineverse.user.dto.FavoriteResponse;
import com.cineverse.user.dto.ReviewRequest;
import com.cineverse.user.dto.ReviewResponse;
import com.cineverse.user.dto.UserProfileRequest;
import com.cineverse.user.dto.UserProfileResponse;
import com.cineverse.user.dto.WatchlistRequest;
import com.cineverse.user.dto.WatchlistResponse;
import com.cineverse.user.entity.Favorite;
import com.cineverse.user.entity.Review;
import com.cineverse.user.entity.User;
import com.cineverse.user.entity.Watchlist;
import com.cineverse.user.repository.FavoriteRepository;
import com.cineverse.user.repository.ReviewRepository;
import com.cineverse.user.repository.UserRepository;
import com.cineverse.user.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final FavoriteRepository favoriteRepository;
    private final WatchlistRepository watchlistRepository;
    private final ReviewRepository reviewRepository;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String email) {
        log.info("Fetching profile details for email: {}", email);
        User user = getUserByEmail(email);
        return mapToProfileResponse(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(String email, UserProfileRequest request) {
        log.info("Updating profile details for email: {}", email);
        User user = getUserByEmail(email);
        user.setFullName(request.getFullName());
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage());
        }
        User updated = userRepository.save(user);
        return mapToProfileResponse(updated);
    }

    @Override
    @Transactional
    public FavoriteResponse addFavorite(String email, FavoriteRequest request) {
        log.info("Adding favorite movie for user: {}", email);
        User user = getUserByEmail(email);

        if (favoriteRepository.existsByUserAndImdbId(user, request.getImdbId())) {
            throw new BadRequestException("Movie is already in favorites");
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .imdbId(request.getImdbId())
                .title(request.getTitle())
                .poster(request.getPoster())
                .type(request.getType())
                .build();

        Favorite saved = favoriteRepository.save(favorite);
        return mapToFavoriteResponse(saved);
    }

    @Override
    @Transactional
    public void removeFavorite(String email, String imdbId) {
        log.info("Removing favorite movie {} for user: {}", imdbId, email);
        User user = getUserByEmail(email);
        Favorite favorite = favoriteRepository.findByUserAndImdbId(user, imdbId)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found"));
        favoriteRepository.delete(favorite);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FavoriteResponse> getFavorites(String email) {
        log.info("Fetching all favorites for user: {}", email);
        User user = getUserByEmail(email);
        return favoriteRepository.findByUser(user).stream()
                .map(this::mapToFavoriteResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WatchlistResponse addToWatchlist(String email, WatchlistRequest request) {
        log.info("Adding movie to watchlist for user: {}", email);
        User user = getUserByEmail(email);

        if (watchlistRepository.existsByUserAndImdbId(user, request.getImdbId())) {
            throw new BadRequestException("Movie is already in watchlist");
        }

        Watchlist watchlist = Watchlist.builder()
                .user(user)
                .imdbId(request.getImdbId())
                .title(request.getTitle())
                .poster(request.getPoster())
                .type(request.getType())
                .build();

        Watchlist saved = watchlistRepository.save(watchlist);
        return mapToWatchlistResponse(saved);
    }

    @Override
    @Transactional
    public void removeFromWatchlist(String email, String imdbId) {
        log.info("Removing watchlist movie {} for user: {}", imdbId, email);
        User user = getUserByEmail(email);
        Watchlist watchlist = watchlistRepository.findByUserAndImdbId(user, imdbId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist entry not found"));
        watchlistRepository.delete(watchlist);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WatchlistResponse> getWatchlist(String email) {
        log.info("Fetching watchlist for user: {}", email);
        User user = getUserByEmail(email);
        return watchlistRepository.findByUser(user).stream()
                .map(this::mapToWatchlistResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReviewResponse addOrUpdateReview(String email, ReviewRequest request) {
        log.info("Adding/updating review for user: {}", email);
        User user = getUserByEmail(email);

        Review review = reviewRepository.findByUserAndImdbId(user, request.getImdbId())
                .map(existing -> {
                    existing.setRating(request.getRating());
                    existing.setComment(request.getComment());
                    return existing;
                })
                .orElseGet(() -> Review.builder()
                        .user(user)
                        .imdbId(request.getImdbId())
                        .movieTitle(request.getMovieTitle())
                        .rating(request.getRating())
                        .comment(request.getComment())
                        .build());

        Review saved = reviewRepository.save(review);
        return mapToReviewResponse(saved);
    }

    @Override
    @Transactional
    public void deleteReview(String email, Long reviewId) {
        log.info("Deleting review ID {} for user: {}", reviewId, email);
        User user = getUserByEmail(email);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this review");
        }

        reviewRepository.delete(review);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByUser(String email) {
        log.info("Fetching reviews written by user: {}", email);
        User user = getUserByEmail(email);
        return reviewRepository.findByUser(user).stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByMovie(String imdbId) {
        log.info("Fetching all reviews for IMDb ID: {}", imdbId);
        return reviewRepository.findByImdbId(imdbId).stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User profile record not found for: " + email));
    }

    private UserProfileResponse mapToProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .profileImage(user.getProfileImage())
                .build();
    }

    private FavoriteResponse mapToFavoriteResponse(Favorite favorite) {
        return FavoriteResponse.builder()
                .id(favorite.getId())
                .imdbId(favorite.getImdbId())
                .title(favorite.getTitle())
                .poster(favorite.getPoster())
                .type(favorite.getType())
                .build();
    }

    private WatchlistResponse mapToWatchlistResponse(Watchlist watchlist) {
        return WatchlistResponse.builder()
                .id(watchlist.getId())
                .imdbId(watchlist.getImdbId())
                .title(watchlist.getTitle())
                .poster(watchlist.getPoster())
                .type(watchlist.getType())
                .build();
    }

    private ReviewResponse mapToReviewResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .username(review.getUser().getUsername())
                .email(review.getUser().getEmail())
                .imdbId(review.getImdbId())
                .movieTitle(review.getMovieTitle())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
