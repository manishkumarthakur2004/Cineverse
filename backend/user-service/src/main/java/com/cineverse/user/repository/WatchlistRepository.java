package com.cineverse.user.repository;

import com.cineverse.user.entity.User;
import com.cineverse.user.entity.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    List<Watchlist> findByUser(User user);
    Optional<Watchlist> findByUserAndImdbId(User user, String imdbId);
    boolean existsByUserAndImdbId(User user, String imdbId);
    void deleteByUserAndImdbId(User user, String imdbId);
}
