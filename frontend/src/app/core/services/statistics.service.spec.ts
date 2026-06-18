import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StatisticsService } from './statistics.service';
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

  afterEach(() => httpMock.verify());

  describe('getQuickStats', () => {
    it('should GET /api/statistics/quick', () => {
      service.getQuickStats().subscribe(data => {
        expect(data.totalCampaigns).toBe(10);
      });
      const req = httpMock.expectOne(`${apiUrl}/quick`);
      expect(req.request.method).toBe('GET');
      req.flush({ totalCampaigns: 10, activeCampaigns: 3, totalParticipants: 100 });
    });
  });

  describe('getEnvironmentalImpact', () => {
    it('should GET /api/statistics/environmental-impact', () => {
      service.getEnvironmentalImpact().subscribe(data => {
        expect(data.plantedTrees).toBe(500);
      });
      const req = httpMock.expectOne(`${apiUrl}/environmental-impact`);
      expect(req.request.method).toBe('GET');
      req.flush({ completedCampaigns: 5, plantedTrees: 500, mitigatedCo2Kg: 1200 });
    });
  });

  describe('getComprehensiveStatistics', () => {
    it('should GET /api/statistics/comprehensive', () => {
      service.getComprehensiveStatistics().subscribe(data => {
        expect(data.totalCampaigns).toBe(20);
      });
      const req = httpMock.expectOne(`${apiUrl}/comprehensive`);
      expect(req.request.method).toBe('GET');
      req.flush({
        totalCampaigns: 20,
        activeCampaigns: 8,
        totalParticipants: 500,
        completedCampaigns: 12,
        plantedTrees: 3000,
        mitigatedCo2Kg: 6000,
        monthlyPlantedTrees: [],
        residueDistribution: [],
        zoneActivity: [],
        volunteerGrowth: [],
        waterSavedLiters: 10000,
        forestAreaHectares: 50
      });
    });
  });

  describe('getCampaignParticipants', () => {
    it('should GET /api/campaigns', () => {
      service.getCampaignParticipants().subscribe(data => {
        expect(data.length).toBe(2);
      });
      const req = httpMock.expectOne(`${environment.apiUrl}/api/campaigns`);
      expect(req.request.method).toBe('GET');
      req.flush([{ id: 1 }, { id: 2 }]);
    });
  });
});
