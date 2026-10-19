package com.cineverse.user.repository;

import com.cineverse.user.entity.Favorite;
import com.cineverse.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);
    Optional<Favorite> findByUserAndImdbId(User user, String imdbId);
    boolean existsByUserAndImdbId(User user, String imdbId);
    void deleteByUserAndImdbId(User user, String imdbId);
}
