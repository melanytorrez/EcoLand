package com.ecoland.infrastructure.config;

import com.ecoland.domain.model.RutaReciclaje;
import com.ecoland.domain.port.out.RutaReciclajeRepositoryPort;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class RutaReciclajeDataInitializer {

    @Bean
    CommandLineRunner initRutas(RutaReciclajeRepositoryPort repository) {
        return args -> {
            if (repository.findAll().isEmpty()) {
                // Ruta 1: Zona Norte (Cala Cala)
                RutaReciclaje r1 = new RutaReciclaje();
                r1.setZona("Zona Norte - Cala Cala");
                r1.setDiaSemana("Lunes y Jueves");
                r1.setHorario("07:00 - 12:00");
                r1.setVehiculoAsignado("Camión Ecológico #1");
                r1.setDescripcion("Recolección de plásticos y papel en la zona norte, inmediaciones del Estadio.");
                r1.setCoordenadas(Arrays.asList(
                    "-17.3700,-66.1550",
                    "-17.3750,-66.1600",
                    "-17.3800,-66.1650",
                    "-17.3850,-66.1700"
                ));
                repository.save(r1);

                // Ruta 2: Centro (Prado y Cancha)
                RutaReciclaje r2 = new RutaReciclaje();
                r2.setZona("Centro Histórico - Prado");
                r2.setDiaSemana("Martes y Viernes");
                r2.setHorario("08:00 - 13:00");
                r2.setVehiculoAsignado("Camión Ecológico #2");
                r2.setDescripcion("Ruta céntrica para recolección de vidrio y metales.");
                r2.setCoordenadas(Arrays.asList(
                    "-17.3900,-66.1550",
                    "-17.3950,-66.1500",
                    "-17.4000,-66.1450",
                    "-17.4050,-66.1400"
                ));
                repository.save(r2);

                // Ruta 3: Zona Sur (Jaihuayco)
                RutaReciclaje r3 = new RutaReciclaje();
                r3.setZona("Zona Sur - Jaihuayco");
                r3.setDiaSemana("Miércoles y Sábado");
                r3.setHorario("14:00 - 19:00");
                r3.setVehiculoAsignado("Camión Ecológico #3");
                r3.setDescripcion("Recolección general en la zona sur de la ciudad.");
                r3.setCoordenadas(Arrays.asList(
                    "-17.4200,-66.1600",
                    "-17.4250,-66.1650",
                    "-17.4300,-66.1700",
                    "-17.4350,-66.1750"
                ));
                repository.save(r3);

                // Ruta 4: Zona Oeste (Blanco Galindo)
                RutaReciclaje r4 = new RutaReciclaje();
                r4.setZona("Zona Oeste - Blanco Galindo");
                r4.setDiaSemana("Lunes y Viernes");
                r4.setHorario("06:00 - 11:00");
                r4.setVehiculoAsignado("Camión Ecológico #4");
                r4.setDescripcion("Ruta por la Av. Blanco Galindo y zonas aledañas.");
                r4.setCoordenadas(Arrays.asList(
                    "-17.3900,-66.1800",
                    "-17.3950,-66.1900",
                    "-17.4000,-66.2000",
                    "-17.4050,-66.2100"
                ));
                repository.save(r4);
            }
        };
    }
}
