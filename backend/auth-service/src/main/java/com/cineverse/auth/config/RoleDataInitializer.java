package com.cineverse.auth.config;

import com.cineverse.common.enums.RoleType;
import com.cineverse.auth.entity.Role;
import com.cineverse.auth.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RoleDataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        initRoleIfNotFound(RoleType.ROLE_USER, "Default application user");
        initRoleIfNotFound(RoleType.ROLE_ADMIN, "System administrator");
        initRoleIfNotFound(RoleType.ROLE_MODERATOR, "Content moderator");
    }

    private void initRoleIfNotFound(RoleType roleType, String description) {
        if (!roleRepository.existsByName(roleType)) {
            Role role = Role.builder()
                    .name(roleType)
                    .description(description)
                    .build();
            roleRepository.save(role);
            log.info("Initialized default role: {}", roleType.name());
        } else {
            log.debug("Role {} already exists, skipping initialization.", roleType.name());
        }
    }
}
