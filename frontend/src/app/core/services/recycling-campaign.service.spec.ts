import { TestBed } from '@angular/core/testing';
import { RecyclingCampaignService } from './recycling-campaign.service';

describe('RecyclingCampaignService', () => {
  let service: RecyclingCampaignService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecyclingCampaignService]
    });
    service = TestBed.inject(RecyclingCampaignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCampaigns', () => {
    it('should return all campaigns as an observable', (done) => {
      service.getCampaigns().subscribe(campaigns => {
        expect(campaigns).toBeDefined();
        expect(campaigns.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should return campaigns with required fields', (done) => {
      service.getCampaigns().subscribe(campaigns => {
        const first = campaigns[0];
        expect(first.id).toBeDefined();
        expect(first.name).toBeDefined();
        expect(first.wasteType).toBeDefined();
        expect(first.status).toBeDefined();
        expect(first.participants).toBeGreaterThanOrEqual(0);
        done();
      });
    });

    it('should include active campaigns', (done) => {
      service.getCampaigns().subscribe(campaigns => {
        const actives = campaigns.filter(c => c.status === 'Activa');
        expect(actives.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should include campaigns with progress data', (done) => {
      service.getCampaigns().subscribe(campaigns => {
        campaigns.forEach(c => {
          expect(c.collected).toBeGreaterThanOrEqual(0);
          expect(c.goalAmount).toBeGreaterThan(0);
          expect(c.collected).toBeLessThanOrEqual(c.goalAmount + 1);
        });
        done();
      });
    });
  });

  describe('getCampaignById', () => {
    it('should return the campaign with the given id', (done) => {
      service.getCampaignById(1).subscribe(campaign => {
        expect(campaign).toBeDefined();
        expect(campaign!.id).toBe(1);
        done();
      });
    });

    it('should return undefined for a non-existent id', (done) => {
      service.getCampaignById(9999).subscribe(campaign => {
        expect(campaign).toBeUndefined();
        done();
      });
    });

    it('should return the campaign matching "Junio sin Plástico"', (done) => {
      service.getCampaignById(1).subscribe(campaign => {
        expect(campaign!.name).toBe('Junio sin Plástico');
        expect(campaign!.wasteType).toBe('Plástico');
        done();
      });
    });
  });
});
