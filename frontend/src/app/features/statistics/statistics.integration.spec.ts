import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';

import { StatisticsComponent } from './statistics.component';

@Pipe({ name: 'translate', standalone: false })
class FakeTranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}
import { StatisticsService } from '../../core/services/statistics.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

describe('StatisticsComponent (Integration)', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  let httpMock: HttpTestingController;

  const translateStub = {
    instant: (key: string, params?: any) => key,
    get: (key: string) => of(key),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

  const mockComprehensiveResponse = {
    totalCampaigns: 25,
    activeCampaigns: 10,
    totalParticipants: 800,
    completedCampaigns: 15,
    plantedTrees: 10000,
    mitigatedCo2Kg: 25000,
    monthlyPlantedTrees: [
      { month: 'Enero', value: 500 },
      { month: 'Febrero', value: 800 }
    ],
    residueDistribution: [
      { type: 'Plástico', amount: 1200 },
      { type: 'Papel', amount: 900 }
    ],
    zoneActivity: [
      { zone: 'Norte', activities: 45 },
      { zone: 'Sur', activities: 30 }
    ],
    volunteerGrowth: [
      { month: 'Enero', totalVolunteers: 100 },
      { month: 'Febrero', totalVolunteers: 150 }
    ],
    waterSavedLiters: 5000000,
    forestAreaHectares: 300
  };

  const mockCampaigns = [
    { id: 1, title: 'Campaign A', participants: 30 },
    { id: 2, title: 'Campaign B', participants: 50 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatisticsComponent, FakeTranslatePipe],
      imports: [HttpClientTestingModule],
      providers: [
        StatisticsService,
        { provide: TranslateService, useValue: translateStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should make two HTTP requests: comprehensive stats and campaigns', () => {
    const comprehensiveReq = httpMock.expectOne(`${environment.apiUrl}/api/statistics/comprehensive`);
    const campaignsReq = httpMock.expectOne(`${environment.apiUrl}/api/campaigns`);

    comprehensiveReq.flush(mockComprehensiveResponse);
    campaignsReq.flush(mockCampaigns);

    expect(component.isLoading).toBeFalse();
    expect(component.data).toBeDefined();
  });

  it('should populate chart data from HTTP response', () => {
    const comprehensiveReq = httpMock.expectOne(`${environment.apiUrl}/api/statistics/comprehensive`);
    const campaignsReq = httpMock.expectOne(`${environment.apiUrl}/api/campaigns`);

    comprehensiveReq.flush(mockComprehensiveResponse);
    campaignsReq.flush(mockCampaigns);

    expect(component.monthlyChartData.labels).toEqual(['Enero', 'Febrero']);
    expect(component.monthlyChartData.datasets[0].data).toEqual([500, 800]);
    expect(component.residueChartData.labels).toContain('Plástico');
    expect(component.zoneChartData.labels).toContain('Norte');
    expect(component.volunteerChartData.labels).toContain('Enero');
  });

  it('should populate campaign chart from campaigns response', () => {
    const comprehensiveReq = httpMock.expectOne(`${environment.apiUrl}/api/statistics/comprehensive`);
    const campaignsReq = httpMock.expectOne(`${environment.apiUrl}/api/campaigns`);

    comprehensiveReq.flush(mockComprehensiveResponse);
    campaignsReq.flush(mockCampaigns);

    expect(component.campaignChartData.labels).toContain('Campaign A');
    expect(component.campaignChartData.datasets[0].data).toContain(30);
  });

  it('should use default data when comprehensive stats request fails (timeout)', () => {
    const comprehensiveReq = httpMock.expectOne(`${environment.apiUrl}/api/statistics/comprehensive`);
    const campaignsReq = httpMock.expectOne(`${environment.apiUrl}/api/campaigns`);

    comprehensiveReq.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    campaignsReq.flush([]);

    expect(component.isLoading).toBeFalse();
    expect(component.data!.totalCampaigns).toBe(0);
  });
});
