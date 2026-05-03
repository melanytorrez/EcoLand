package com.ecoland.infrastructure.adapter.out.persistence;

import com.ecoland.domain.model.PuntoVerde;
import com.ecoland.domain.model.PuntoVerdeHorario;
import com.ecoland.domain.port.out.PuntoVerdeRepositoryPort;
import com.ecoland.infrastructure.entity.PuntoVerdeEntity;
import com.ecoland.infrastructure.entity.PuntoVerdeHorarioEntity;
import com.ecoland.infrastructure.repository.JpaPuntoVerdeRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class PuntoVerdeRepositoryAdapter implements PuntoVerdeRepositoryPort {

    private final JpaPuntoVerdeRepository jpaRepository;

    public PuntoVerdeRepositoryAdapter(JpaPuntoVerdeRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<PuntoVerde> findAll() {
        return jpaRepository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<PuntoVerde> findById(Long id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public PuntoVerde save(PuntoVerde puntoVerde) {
        PuntoVerdeEntity entity = toEntity(puntoVerde);
        return toDomain(jpaRepository.save(entity));
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    // ─── Mappers ─────────────────────────────────────────────────────

    private PuntoVerde toDomain(PuntoVerdeEntity e) {
        PuntoVerde p = new PuntoVerde();
        p.setId(e.getId());
        p.setCreatorId(e.getCreatorId());
        p.setNombre(e.getNombre());
        p.setDireccion(e.getDireccion());
        p.setZona(e.getZona());
        p.setEstado(e.getEstado());
        p.setTiposMaterial(e.getTiposMaterial());
        p.setLatitud(e.getLatitud());
        p.setLongitud(e.getLongitud());

        if (e.getHorarios() != null) {
            p.setHorarios(e.getHorarios().stream()
                    .map(this::horarioDomain)
                    .collect(Collectors.toList()));
        }
        return p;
    }

    private PuntoVerdeHorario horarioDomain(PuntoVerdeHorarioEntity h) {
        PuntoVerdeHorario horario = new PuntoVerdeHorario();
        horario.setId(h.getId());
        horario.setDiaSemana(h.getDiaSemana());
        horario.setHoraApertura(h.getHoraApertura());
        horario.setHoraCierre(h.getHoraCierre());
        return horario;
    }

    private PuntoVerdeEntity toEntity(PuntoVerde p) {
        PuntoVerdeEntity e = new PuntoVerdeEntity();
        e.setId(p.getId());
        e.setCreatorId(p.getCreatorId());
        e.setNombre(p.getNombre());
        e.setDireccion(p.getDireccion());
        e.setZona(p.getZona());
        e.setEstado(p.getEstado());
        e.setTiposMaterial(p.getTiposMaterial());
        e.setLatitud(p.getLatitud());
        e.setLongitud(p.getLongitud());

        if (p.getHorarios() != null) {
            List<PuntoVerdeHorarioEntity> horariosEntity = p.getHorarios().stream()
                    .map(h -> {
                        PuntoVerdeHorarioEntity he = new PuntoVerdeHorarioEntity();
                        he.setId(h.getId());
                        he.setDiaSemana(h.getDiaSemana());
                        he.setHoraApertura(h.getHoraApertura());
                        he.setHoraCierre(h.getHoraCierre());
                        he.setPuntoVerde(e); // relación bidireccional
                        return he;
                    })
                    .collect(Collectors.toList());
            e.setHorarios(horariosEntity);
        }
        return e;
    }
}
