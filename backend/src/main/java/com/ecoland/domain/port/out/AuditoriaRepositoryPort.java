package com.ecoland.domain.port.out;

import com.ecoland.domain.model.AuditoriaLog;

public interface AuditoriaRepositoryPort {
    AuditoriaLog save(AuditoriaLog log);
}
