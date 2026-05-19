import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StatisticsService, QuickStats, EnvironmentalImpact, ComprehensiveStatistics } from './statistics.service';
import { environment } from '../../../environments/environment';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/api/statistics`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StatisticsService]
    });
    service = TestBed.inject(StatisticsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getQuickStats', () => {
    it('should GET quick stats from the API', () => {
      const mockStats: QuickStats = { totalCampaigns: 10, activeCampaigns: 4, totalParticipants: 250 };

      service.getQuickStats().subscribe(stats => {
        expect(stats.totalCampaigns).toBe(10);
        expect(stats.activeCampaigns).toBe(4);
        expect(stats.totalParticipants).toBe(250);
      });

      const req = httpMock.expectOne(`${apiUrl}/quick`);
      expect(req.request.method).toBe('GET');
      req.flush(mockStats);
    });
  });

  describe('getEnvironmentalImpact', () => {
    it('should GET environmental impact data from the API', () => {
      const mockImpact: EnvironmentalImpact = { completedCampaigns: 5, plantedTrees: 200, mitigatedCo2Kg: 4354.0 };

      service.getEnvironmentalImpact().subscribe(impact => {
        expect(impact.completedCampaigns).toBe(5);
        expect(impact.plantedTrees).toBe(200);
        expect(impact.mitigatedCo2Kg).toBe(4354.0);
      });

      const req = httpMock.expectOne(`${apiUrl}/environmental-impact`);
      expect(req.request.method).toBe('GET');
      req.flush(mockImpact);
    });
  });

  describe('getComprehensiveStatistics', () => {
    it('should GET comprehensive statistics from the API', () => {
      const mockStats: ComprehensiveStatistics = {
        totalCampaigns: 10,
        activeCampaigns: 4,
        totalParticipants: 250,
        completedCampaigns: 5,
        plantedTrees: 200,
        mitigatedCo2Kg: 4354.0,
        monthlyPlantedTrees: [{ month: 'May', value: 50 }],
        residueDistribution: [{ type: 'Plástico', amount: 500 }],
        zoneActivity: [{ zone: 'Norte', activities: 3 }],
        volunteerGrowth: [{ month: 'May', totalVolunteers: 50 }],
        waterSavedLiters: 600000,
        forestAreaHectares: 0.2
      };

      service.getComprehensiveStatistics().subscribe(stats => {
        expect(stats.totalCampaigns).toBe(10);
        expect(stats.monthlyPlantedTrees.length).toBe(1);
        expect(stats.residueDistribution[0].type).toBe('Plástico');
        expect(stats.waterSavedLiters).toBe(600000);
      });

      const req = httpMock.expectOne(`${apiUrl}/comprehensive`);
      expect(req.request.method).toBe('GET');
      req.flush(mockStats);
    });
  });

  describe('getCampaignParticipants', () => {
    it('should GET campaigns from the campaigns endpoint', () => {
      const mockCampaigns = [{ id: 1, title: 'Reforestación Tunari', participants: 50 }];

      service.getCampaignParticipants().subscribe(campaigns => {
        expect(campaigns.length).toBe(1);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/campaigns`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCampaigns);
    });
  });
});
