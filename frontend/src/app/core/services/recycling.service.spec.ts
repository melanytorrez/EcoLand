import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RecyclingService } from './recycling.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('RecyclingService', () => {
  let service: RecyclingService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const puntosUrl = `${environment.apiUrl}/api/puntos-verdes`;
  const rutasUrl = `${environment.apiUrl}/api/v1/rutas`;
  const activitiesUrl = `${environment.apiUrl}/api/v1/recycling-activities`;
  const token = 'recycling-token';

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue(token);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RecyclingService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
    service = TestBed.inject(RecyclingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('getPuntosVerdes', () => {
    it('should GET /api/puntos-verdes and map response', () => {
      const raw = [{ id: 1, nombre: 'P1', direccion: 'Calle 1', estado: 'ACTIVO', latitud: -17.4, longitud: -66.1 }];
      let result: any;
      service.getPuntosVerdes().subscribe(pts => result = pts);
      const req = httpMock.expectOne(puntosUrl);
      expect(req.request.method).toBe('GET');
      req.flush(raw);
      expect(result[0].activo).toBeTrue();
      expect(result[0].nombre).toBe('P1');
    });

    it('should set activo to false for estado=CERRADO', () => {
      const raw = [{ id: 2, nombre: 'P2', direccion: 'Calle 2', estado: 'CERRADO' }];
      let result: any;
      service.getPuntosVerdes().subscribe(pts => result = pts);
      httpMock.expectOne(puntosUrl).flush(raw);
      expect(result[0].activo).toBeFalse();
    });

    it('should default zona to "Cerca de ti" when absent', () => {
      const raw = [{ id: 3, nombre: 'P3', direccion: 'Dir', estado: 'ACTIVO' }];
      let result: any;
      service.getPuntosVerdes().subscribe(pts => result = pts);
      httpMock.expectOne(puntosUrl).flush(raw);
      expect(result[0].zona).toBe('Cerca de ti');
    });
  });

  describe('getPuntoVerdeById', () => {
    it('should GET /api/puntos-verdes/:id and map response', () => {
      let result: any;
      service.getPuntoVerdeById(1).subscribe(p => result = p);
      const req = httpMock.expectOne(`${puntosUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ id: 1, nombre: 'P1', direccion: 'D', estado: 'ACTIVO' });
      expect(result.id).toBe(1);
    });
  });

  describe('createPuntoVerde', () => {
    it('should POST /api/puntos-verdes', () => {
      service.createPuntoVerde({ nombre: 'Nuevo' }).subscribe();
      const req = httpMock.expectOne(puntosUrl);
      expect(req.request.method).toBe('POST');
      req.flush({ id: 10, nombre: 'Nuevo', direccion: '', estado: 'ACTIVO' });
    });
  });

  describe('updatePuntoVerde', () => {
    it('should PUT /api/puntos-verdes/:id', () => {
      service.updatePuntoVerde(5, { nombre: 'Updated' }).subscribe();
      const req = httpMock.expectOne(`${puntosUrl}/5`);
      expect(req.request.method).toBe('PUT');
      req.flush({ id: 5, nombre: 'Updated', direccion: '', estado: 'ACTIVO' });
    });
  });

  describe('deletePuntoVerde', () => {
    it('should DELETE /api/puntos-verdes/:id', () => {
      service.deletePuntoVerde(5).subscribe();
      const req = httpMock.expectOne(`${puntosUrl}/5`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('registerRecyclingActivity', () => {
    it('should POST /api/v1/recycling-activities with Bearer header', () => {
      const req_data: any = { puntoVerdeId: 1, tipo: 'Plástico', cantidad: 2 };
      service.registerRecyclingActivity(req_data).subscribe();
      const req = httpMock.expectOne(activitiesUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush({});
    });
  });

  describe('getMyRecyclingActivities', () => {
    it('should GET /api/v1/recycling-activities/me with Bearer header', () => {
      service.getMyRecyclingActivities().subscribe();
      const req = httpMock.expectOne(`${activitiesUrl}/me`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush([]);
    });
  });

  describe('getNearbyPoints', () => {
    it('should delegate to getPuntosVerdes', () => {
      service.getNearbyPoints().subscribe();
      const req = httpMock.expectOne(puntosUrl);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getRutas', () => {
    it('should GET /api/v1/rutas', () => {
      service.getRutas().subscribe();
      const req = httpMock.expectOne(rutasUrl);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getNextCollection', () => {
    it('should map first ruta to CollectionRoute', () => {
      let result: any;
      service.getNextCollection().subscribe(r => result = r);
      const req = httpMock.expectOne(rutasUrl);
      req.flush([{ diaSemana: 'Lunes', horario: '08:00', zona: 'Norte', vehiculoAsignado: 'Camión 1' }]);
      expect(result!.day).toBe('Lunes');
      expect(result!.zone).toBe('Norte');
    });

    it('should return undefined for empty rutas list', () => {
      let result: any = 'initial';
      service.getNextCollection().subscribe(r => result = r);
      httpMock.expectOne(rutasUrl).flush([]);
      expect(result).toBeUndefined();
    });
  });

  describe('getEnvironmentalImpact', () => {
    it('should return static impact data without HTTP call', () => {
      let result: any;
      service.getEnvironmentalImpact().subscribe(i => result = i);
      httpMock.expectNone(puntosUrl);
      expect(result.recycled).toBeDefined();
      expect(result.trees).toBeDefined();
    });
  });

  describe('getRoutePath', () => {
    it('should return original coords when length < 2', () => {
      const coords: [number, number][] = [[-17.4, -66.1]];
      let result: any;
      service.getRoutePath(coords).subscribe(r => result = r);
      expect(result).toEqual(coords);
      httpMock.expectNone((r) => r.url.includes('osrm'));
    });

    it('should return original coords when empty', () => {
      let result: any;
      service.getRoutePath([]).subscribe(r => result = r);
      expect(result).toEqual([]);
    });

    it('should convert OSRM [lng,lat] coordinates to [lat,lng] for Leaflet', () => {
      const coords: [number, number][] = [[-17.4, -66.1], [-17.5, -66.2]];
      let result: any;
      service.getRoutePath(coords).subscribe(r => result = r);

      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/-66.1,-17.4;-66.2,-17.5?overview=full&geometries=geojson`;
      const req = httpMock.expectOne(osrmUrl);
      req.flush({
        code: 'Ok',
        routes: [{ geometry: { coordinates: [[-66.1, -17.4], [-66.15, -17.45]] } }]
      });
      expect(result[0]).toEqual([-17.4, -66.1]);
      expect(result[1]).toEqual([-17.45, -66.15]);
    });

    it('should fallback to original coords on OSRM error code', () => {
      const coords: [number, number][] = [[-17.4, -66.1], [-17.5, -66.2]];
      let result: any;
      service.getRoutePath(coords).subscribe(r => result = r);
      const req = httpMock.expectOne((r) => r.url.includes('osrm'));
      req.flush({ code: 'Error', routes: [] });
      expect(result).toEqual(coords);
    });
  });
});
