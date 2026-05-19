import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RecyclingService } from './recycling.service';
import { environment } from '../../../environments/environment';

describe('RecyclingService', () => {
  let service: RecyclingService;
  let httpMock: HttpTestingController;

  const puntosUrl = `${environment.apiUrl}/api/puntos-verdes`;
  const rutasUrl = `${environment.apiUrl}/api/v1/rutas`;

  const mockPuntoRaw = {
    id: 1,
    nombre: 'Punto Verde Norte',
    direccion: 'Av. América #123',
    zona: 'Norte',
    estado: 'ACTIVO',
    horarios: ['08:00-12:00'],
    tiposMaterial: ['Plástico', 'Papel'],
    latitud: -17.39,
    longitud: -66.15,
    imagenUrl: null
  };

  const mockRuta = {
    id: 1,
    zona: 'Norte',
    diaSemana: 'Lunes',
    horario: '08:00-12:00',
    vehiculoAsignado: 'Camión 01',
    descripcion: 'Ruta norte',
    coordenadas: ['-17.39,-66.15']
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecyclingService]
    });
    service = TestBed.inject(RecyclingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPuntosVerdes', () => {
    it('should GET and map puntos verdes from API', () => {
      service.getPuntosVerdes().subscribe(puntos => {
        expect(puntos.length).toBe(1);
        expect(puntos[0].nombre).toBe('Punto Verde Norte');
        expect(puntos[0].activo).toBeTrue();
        expect(puntos[0].zona).toBe('Norte');
      });

      const req = httpMock.expectOne(puntosUrl);
      expect(req.request.method).toBe('GET');
      req.flush([mockPuntoRaw]);
    });

    it('should map estado ACTIVO to activo=true', () => {
      service.getPuntosVerdes().subscribe(puntos => {
        expect(puntos[0].activo).toBeTrue();
      });
      httpMock.expectOne(puntosUrl).flush([mockPuntoRaw]);
    });

    it('should map inactive estado to activo=false', () => {
      const inactivePunto = { ...mockPuntoRaw, estado: 'INACTIVO' };
      service.getPuntosVerdes().subscribe(puntos => {
        expect(puntos[0].activo).toBeFalse();
      });
      httpMock.expectOne(puntosUrl).flush([inactivePunto]);
    });
  });

  describe('getPuntoVerdeById', () => {
    it('should GET a single punto verde by id', () => {
      service.getPuntoVerdeById(1).subscribe(punto => {
        expect(punto.id).toBe(1);
        expect(punto.nombre).toBe('Punto Verde Norte');
      });

      const req = httpMock.expectOne(`${puntosUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPuntoRaw);
    });
  });

  describe('createPuntoVerde', () => {
    it('should POST to create a new punto verde', () => {
      const newPunto = { nombre: 'Nuevo Punto', direccion: 'Av. Nueva #456' };
      service.createPuntoVerde(newPunto).subscribe(punto => {
        expect(punto.nombre).toBe('Punto Verde Norte');
      });

      const req = httpMock.expectOne(puntosUrl);
      expect(req.request.method).toBe('POST');
      req.flush(mockPuntoRaw);
    });
  });

  describe('updatePuntoVerde', () => {
    it('should PUT to update an existing punto verde', () => {
      const updatedData = { nombre: 'Punto Actualizado' };
      service.updatePuntoVerde(1, updatedData).subscribe(punto => {
        expect(punto.id).toBe(1);
      });

      const req = httpMock.expectOne(`${puntosUrl}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockPuntoRaw);
    });
  });

  describe('deletePuntoVerde', () => {
    it('should DELETE a punto verde by id', () => {
      service.deletePuntoVerde(1).subscribe();

      const req = httpMock.expectOne(`${puntosUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('getRutas', () => {
    it('should GET recycling routes from API', () => {
      service.getRutas().subscribe(rutas => {
        expect(rutas.length).toBe(1);
        expect(rutas[0].zona).toBe('Norte');
        expect(rutas[0].diaSemana).toBe('Lunes');
      });

      const req = httpMock.expectOne(rutasUrl);
      expect(req.request.method).toBe('GET');
      req.flush([mockRuta]);
    });
  });

  describe('getNextCollection', () => {
    it('should return the first route mapped as a CollectionRoute', () => {
      service.getNextCollection().subscribe(collection => {
        expect(collection).toBeDefined();
        expect(collection!.zone).toBe('Norte');
        expect(collection!.vehicle).toBe('Camión 01');
      });

      httpMock.expectOne(rutasUrl).flush([mockRuta]);
    });

    it('should return undefined when no routes exist', () => {
      service.getNextCollection().subscribe(collection => {
        expect(collection).toBeUndefined();
      });

      httpMock.expectOne(rutasUrl).flush([]);
    });
  });

  describe('getEnvironmentalImpact', () => {
    it('should return static impact data without HTTP call', () => {
      service.getEnvironmentalImpact().subscribe(impact => {
        expect(impact.recycled).toBeDefined();
        expect(impact.trees).toBeDefined();
        expect(impact.co2).toBeDefined();
      });

      httpMock.expectNone(puntosUrl);
    });
  });
});
