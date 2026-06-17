import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { of, throwError } from 'rxjs';

import { ReciclajeComponent } from './reciclaje.component';

@Pipe({ name: 'translate', standalone: false })
class FakeTranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}
import { RecyclingService } from '../../core/services/recycling.service';
import { TranslateService } from '@ngx-translate/core';

describe('ReciclajeComponent', () => {
  let component: ReciclajeComponent;
  let fixture: ComponentFixture<ReciclajeComponent>;
  let recyclingServiceSpy: jasmine.SpyObj<RecyclingService>;

  const mockPoints: any[] = [
    { id: 1, nombre: 'P1', activo: true, latitud: -17.4, longitud: -66.1 },
    { id: 2, nombre: 'P2', activo: false, latitud: -17.5, longitud: -66.2 }
  ];

  const mockRutas: any[] = [
    { diaSemana: 'Lunes', horario: '08:00-12:00', zona: 'Norte', vehiculoAsignado: 'Camión 1', coordenadas: [] }
  ];

  const mockCollectionRoute: any = { day: 'Lunes', zone: 'Norte' };
  const mockImpact: any = { recycled: '100 kg', trees: '5', co2: '200 kg', rank: 'Top 10%' };

  const translateStub = {
    instant: (key: string) => key,
    get: () => of(''),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

  beforeEach(async () => {
    recyclingServiceSpy = jasmine.createSpyObj('RecyclingService', [
      'getPuntosVerdes', 'getRutas', 'getNextCollection', 'getEnvironmentalImpact', 'getRoutePath'
    ]);
    recyclingServiceSpy.getPuntosVerdes.and.returnValue(of(mockPoints));
    recyclingServiceSpy.getRutas.and.returnValue(of(mockRutas));
    recyclingServiceSpy.getNextCollection.and.returnValue(of(mockCollectionRoute));
    recyclingServiceSpy.getEnvironmentalImpact.and.returnValue(of(mockImpact));

    await TestBed.configureTestingModule({
      declarations: [ReciclajeComponent, FakeTranslatePipe],
      providers: [
        { provide: RecyclingService, useValue: recyclingServiceSpy },
        { provide: TranslateService, useValue: translateStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ReciclajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load nearby points and set loadingPoints=false', () => {
      expect(component.nearbyPoints.length).toBe(2);
      expect(component.loadingPoints).toBeFalse();
    });

    it('should set pointsError on service failure', () => {
      recyclingServiceSpy.getPuntosVerdes.and.returnValue(throwError(() => new Error('Network error')));
      component.ngOnInit();
      expect(component.pointsError).toBeTruthy();
      expect(component.loadingPoints).toBeFalse();
    });

    it('should load rutas from service', () => {
      expect(component.rutas.length).toBe(1);
    });

    it('should set rutas to [] on service failure', () => {
      recyclingServiceSpy.getRutas.and.returnValue(throwError(() => new Error('fail')));
      component.ngOnInit();
      expect(component.rutas).toEqual([]);
    });

    it('should load next collection route', () => {
      expect(component.nextCollection).toEqual(mockCollectionRoute);
    });

    it('should load environmental impact', () => {
      expect(component.impact).toEqual(mockImpact);
    });
  });

  describe('getPointStatus', () => {
    it('should return "Abierto" for active point', () => {
      expect(component.getPointStatus({ activo: true } as any)).toBe('Abierto');
    });

    it('should return "Cerrado" for inactive point', () => {
      expect(component.getPointStatus({ activo: false } as any)).toBe('Cerrado');
    });
  });

  describe('getPointHours', () => {
    it('should return formatted hours when horarios exist', () => {
      const point: any = { horarios: [{ diaSemana: 'Lunes', horaApertura: '08:00', horaCierre: '17:00' }] };
      expect(component.getPointHours(point)).toBe('Lunes 08:00 - 17:00');
    });

    it('should return translate key when no horarios', () => {
      const point: any = { horarios: [] };
      const result = component.getPointHours(point);
      expect(result).toBe('recycling.points_card.hours_unavailable');
    });
  });
});
