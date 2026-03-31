package com.ecoland.infrastructure.config;

import com.ecoland.infrastructure.entity.CampaignEntity;
import com.ecoland.infrastructure.repository.JpaCampaignRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class CampaignDataInitializer {

    @Bean
    CommandLineRunner seedCampaigns(JpaCampaignRepository campaignRepository) {
        return args -> {
            if (campaignRepository.count() > 0) {
                return;
            }

            campaignRepository.saveAll(List.of(
                    campaign(
                            "https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzJTIwZm9yZXN0fGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080",
                            "Reforestacion Parque Tunari",
                            "24 de Febrero, 2026",
                            "08:00 AM - 02:00 PM",
                            "Parque Nacional Tunari",
                            "Entrada principal del Parque Tunari, carretera a Sacaba",
                            45,
                            32,
                            "Alcaldia de Cochabamba",
                            "eventos@cochabamba.gob.bo",
                            "Activa",
                            "Campana enfocada en recuperar areas degradadas del Parque Nacional Tunari.",
                            List.of(
                                    "Ser mayor de 12 anos (menores acompanados)",
                                    "Inscripcion previa obligatoria",
                                    "Compromiso de asistencia"
                            )
                    ),
                    campaign(
                            "https://images.unsplash.com/photo-1729434170023-cad95b4e419f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHJlZm9yZXN0YXRpb24lMjBwYXJrJTIwbmF0dXJlfGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080",
                            "Bosques Urbanos Centro",
                            "28 de Febrero, 2026",
                            null,
                            "Plaza Colon",
                            null,
                            30,
                            18,
                            "EcoLand",
                            null,
                            "Activa",
                            "Reforestacion urbana para incrementar cobertura arborea en el centro.",
                            List.of()
                    ),
                    campaign(
                            "https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzJTIwZm9yZXN0fGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080",
                            "Recuperacion Zona Sur",
                            "5 de Marzo, 2026",
                            null,
                            "Av. Blanco Galindo",
                            null,
                            60,
                            42,
                            "ONG Verde Bolivia",
                            null,
                            "Activa",
                            "Jornada de plantacion en area periurbana para recuperar suelos.",
                            List.of()
                    )
            ));
        };
    }

    private CampaignEntity campaign(
            String image,
            String title,
            String date,
            String time,
            String location,
            String address,
            int spots,
            int participants,
            String organizer,
            String organizerContact,
            String status,
            String description,
            List<String> requirements
    ) {
        CampaignEntity entity = new CampaignEntity();
        entity.setImage(image);
        entity.setTitle(title);
        entity.setDate(date);
        entity.setTime(time);
        entity.setLocation(location);
        entity.setAddress(address);
        entity.setSpots(spots);
        entity.setParticipants(participants);
        entity.setOrganizer(organizer);
        entity.setOrganizerContact(organizerContact);
        entity.setStatus(status);
        entity.setDescription(description);
        entity.setRequirements(requirements);
        return entity;
    }
}
