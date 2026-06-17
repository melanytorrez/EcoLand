import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';

import { ReforestacionComponent } from './reforestacion.component';

@Pipe({ name: 'translate', standalone: false })
class FakeTranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}
import { CampaignService } from '../../core/services/campaign.service';
import { AuthService } from '../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

describe('ReforestacionComponent (Integration)', () => {
  let component: ReforestacionComponent;
  let fixture: ComponentFixture<ReforestacionComponent>;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const translateStub = {
    instant: (key: string) => key,
    get: () => of(''),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

  const mockCampaigns = [
    { id: 1, title: 'Árboles del Norte', location: 'Zona Norte', category: 'REFORESTATION', spots: 20, participants: 10 },
    { id: 2, title: 'Selva Verde', location: 'Zona Centro', category: 'REFORESTATION', spots: 30, participants: 15 },
    { id: 3, title: 'Bosque Sur', location: 'Zona Sur', category: 'REFORESTATION', spots: 15, participants: 8 }
  ];

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    authServiceSpy.isAuthenticated.and.returnValue(true);

    await TestBed.configureTestingModule({
      declarations: [ReforestacionComponent, FakeTranslatePipe],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        CampaignService,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TranslateService, useValue: translateStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ReforestacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should GET /api/campaigns?category=REFORESTATION on init', () => {
    const req = httpMock.expectOne(r =>
      r.url === `${environment.apiUrl}/api/campaigns` &&
      r.params.get('category') === 'REFORESTATION'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockCampaigns);

    expect(component.campaigns.length).toBe(3);
    expect(component.filteredCampaigns.length).toBe(3);
    expect(component.isLoading).toBeFalse();
  });

  it('should filter campaigns after HTTP response is received', () => {
    const req = httpMock.expectOne(r => r.url === `${environment.apiUrl}/api/campaigns`);
    req.flush(mockCampaigns);

    component.searchTerm = 'norte';
    component.filterCampaigns();
    expect(component.filteredCampaigns.length).toBe(1);
    expect(component.filteredCampaigns[0].title).toBe('Árboles del Norte');
  });

  it('should set error state when API returns 500', () => {
    const req = httpMock.expectOne(r => r.url === `${environment.apiUrl}/api/campaigns`);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(component.error).toBeTruthy();
    expect(component.campaigns.length).toBe(0);
    expect(component.isLoading).toBeFalse();
  });

  it('should make a second HTTP request on retry', () => {
    const req1 = httpMock.expectOne(r => r.url === `${environment.apiUrl}/api/campaigns`);
    req1.flush(mockCampaigns);

    component.retry();

    const req2 = httpMock.expectOne(r => r.url === `${environment.apiUrl}/api/campaigns`);
    req2.flush(mockCampaigns);

    expect(component.campaigns.length).toBe(3);
  });
});
