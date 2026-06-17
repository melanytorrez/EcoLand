import { TestBed } from '@angular/core/testing';
import { RecyclingCampaignService } from './recycling-campaign.service';

describe('RecyclingCampaignService', () => {
  let service: RecyclingCampaignService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [RecyclingCampaignService] });
    service = TestBed.inject(RecyclingCampaignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCampaigns', () => {
    it('should return all 6 mock campaigns', () => {
      let result: any[];
      service.getCampaigns().subscribe(campaigns => result = campaigns);
      expect(result!.length).toBe(6);
    });

    it('should return campaigns with required fields', () => {
      service.getCampaigns().subscribe(campaigns => {
        campaigns.forEach(c => {
          expect(c.id).toBeDefined();
          expect(c.name).toBeDefined();
          expect(c.wasteType).toBeDefined();
          expect(c.goalAmount).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('getCampaignById', () => {
    it('should return campaign with matching id', () => {
      let result: any;
      service.getCampaignById(1).subscribe(c => result = c);
      expect(result).toBeDefined();
      expect(result!.id).toBe(1);
    });

    it('should return the campaign with id 3', () => {
      let result: any;
      service.getCampaignById(3).subscribe(c => result = c);
      expect(result!.name).toBe('Vidrio para el Futuro');
    });

    it('should return undefined for non-existent id', () => {
      let result: any = 'initial';
      service.getCampaignById(999).subscribe(c => result = c);
      expect(result).toBeUndefined();
    });
  });
});
