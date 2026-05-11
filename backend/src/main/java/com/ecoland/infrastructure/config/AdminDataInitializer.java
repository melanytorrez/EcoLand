package com.ecoland.infrastructure.config;

import com.ecoland.infrastructure.entity.RolEntity;
import com.ecoland.infrastructure.entity.UsuarioEntity;
import com.ecoland.infrastructure.repository.JpaRolRepository;
import com.ecoland.infrastructure.repository.JpaUsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class AdminDataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(AdminDataInitializer.class);

    @Bean
    CommandLineRunner initAdminUser(JpaUsuarioRepository usuarioRepository,
                                    JpaRolRepository rolRepository,
                                    PasswordEncoder passwordEncoder) {
        return args -> {
            try {
                // Asegurar que los roles básicos existen
                RolEntity adminRole = rolRepository.findByNombre(AppConstants.ROLE_ADMIN)
                        .orElseGet(() -> {
                            RolEntity newRole = new RolEntity();
                            newRole.setNombre(AppConstants.ROLE_ADMIN);
                            RolEntity saved = rolRepository.save(newRole);
                            rolRepository.flush();
                            logger.info("Rol '{}' creado con id: {}", AppConstants.ROLE_ADMIN, saved.getId());
                            return saved;
                        });

                rolRepository.findByNombre(AppConstants.ROLE_USER)
                        .orElseGet(() -> {
                            RolEntity newRole = new RolEntity();
                            newRole.setNombre(AppConstants.ROLE_USER);
                            RolEntity saved = rolRepository.save(newRole);
                            rolRepository.flush();
                            logger.info("Rol '{}' creado con id: {}", AppConstants.ROLE_USER, saved.getId());
                            return saved;
                        });

                rolRepository.findByNombre(AppConstants.ROLE_LEADER)
                        .orElseGet(() -> {
                            RolEntity newRole = new RolEntity();
                            newRole.setNombre(AppConstants.ROLE_LEADER);
                            RolEntity saved = rolRepository.save(newRole);
                            rolRepository.flush();
                            logger.info("Rol '{}' creado con id: {}", AppConstants.ROLE_LEADER, saved.getId());
                            return saved;
                        });

                // Re-leer el rol admin de la BD para asegurar que tiene un ID real
                RolEntity adminRoleFromDb = rolRepository.findByNombre(AppConstants.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("No se pudo encontrar el rol ADMINISTRADOR"));

                // Verificar si el admin por defecto existe
                String adminEmail = "admin@ecoland.com";
                if (usuarioRepository.findByEmail(adminEmail).isEmpty()) {
                    UsuarioEntity adminUser = new UsuarioEntity();
                    adminUser.setNombre("Super Administrador");
                    adminUser.setEmail(adminEmail);
                    adminUser.setPassword(passwordEncoder.encode("admin1234"));
                    adminUser.setEstadoSolicitud(com.ecoland.domain.model.EstadoSolicitud.NONE);

                    // Asignar roles al usuario
                    Set<RolEntity> roles = new HashSet<>();
                    roles.add(adminRoleFromDb);
                    adminUser.setRoles(roles);

                    usuarioRepository.saveAndFlush(adminUser);
                    logger.info("Usuario Administrador por defecto creado: {} / admin1234", adminEmail);
                }
            } catch (Exception e) {
                logger.error("Error crítico inicializando datos básicos: {}. Verifique la conexión a la BD y las restricciones de integridad.", e.getMessage(), e);
            }
        };
    }
}
