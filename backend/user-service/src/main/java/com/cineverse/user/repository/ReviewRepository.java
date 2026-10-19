package com.cineverse.user.repository;

import com.cineverse.user.entity.Review;
import com.cineverse.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUser(User user);
    Optional<Review> findByUserAndImdbId(User user, String imdbId);
    List<Review> findByImdbId(String imdbId);
    boolean existsByUserAndImdbId(User user, String imdbId);
}
