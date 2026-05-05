package com.ecoland.infrastructure.config;

import com.ecoland.infrastructure.entity.RolEntity;
import com.ecoland.infrastructure.entity.UsuarioEntity;
import com.ecoland.infrastructure.repository.JpaRolRepository;
import com.ecoland.infrastructure.repository.JpaUsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class AdminDataInitializer {

    @Bean
    CommandLineRunner initAdminUser(JpaUsuarioRepository usuarioRepository,
                                    JpaRolRepository rolRepository,
                                    PasswordEncoder passwordEncoder) {
        return args -> {
            // Asegurar que los roles básicos existen
            RolEntity adminRole = rolRepository.findByNombre(AppConstants.ROLE_ADMIN)
                    .orElseGet(() -> {
                        RolEntity newRole = new RolEntity();
                        newRole.setNombre(AppConstants.ROLE_ADMIN);
                        return rolRepository.save(newRole);
                    });

            rolRepository.findByNombre(AppConstants.ROLE_USER)
                    .orElseGet(() -> {
                        RolEntity newRole = new RolEntity();
                        newRole.setNombre(AppConstants.ROLE_USER);
                        return rolRepository.save(newRole);
                    });
                    
            rolRepository.findByNombre(AppConstants.ROLE_LEADER)
                    .orElseGet(() -> {
                        RolEntity newRole = new RolEntity();
                        newRole.setNombre(AppConstants.ROLE_LEADER);
                        return rolRepository.save(newRole);
                    });

            // Verificar si el admin por defecto existe
            String adminEmail = "admin@ecoland.com";
            if (usuarioRepository.findByEmail(adminEmail).isEmpty()) {
                UsuarioEntity adminUser = new UsuarioEntity();
                adminUser.setNombre("Super Administrador");
                adminUser.setEmail(adminEmail);
                // Contraseña por defecto: "admin1234"
                adminUser.setPassword(passwordEncoder.encode("admin1234"));
                
                Set<RolEntity> roles = new HashSet<>();
                roles.add(adminRole);
                adminUser.setRoles(roles);

                usuarioRepository.save(adminUser);
                System.out.println("Usuario Administrador por defecto creado: " + adminEmail + " / admin1234");
            }
        };
    }
}
