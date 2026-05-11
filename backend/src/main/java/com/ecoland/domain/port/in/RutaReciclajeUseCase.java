package com.ecoland.domain.port.in;

import com.ecoland.domain.model.RutaReciclaje;
import java.util.List;

public interface RutaReciclajeUseCase {
    List<RutaReciclaje> getAllRutas();
}
