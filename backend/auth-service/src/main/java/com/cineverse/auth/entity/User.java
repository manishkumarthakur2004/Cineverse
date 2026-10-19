package com.cineverse.auth.entity;

import com.cineverse.common.entity.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    @ToString.Include
    private UUID id;

    @Column(name = "full_name", nullable = false, length = 100)
    @ToString.Include
    private String fullName;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    @ToString.Include
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    @ToString.Include
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "profile_image", length = 500)
    private String profileImage;

    @Builder.Default
    @Column(name = "is_enabled", nullable = false)
    private Boolean enabled = true;

    @Builder.Default
    @Column(name = "is_account_non_locked", nullable = false)
    private Boolean accountNonLocked = true;

    @Builder.Default
    @Column(name = "is_account_non_expired", nullable = false)
    private Boolean accountNonExpired = true;

    @Builder.Default
    @Column(name = "is_credentials_non_expired", nullable = false)
    private Boolean credentialsNonExpired = true;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();
}
