import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CampaignService } from './campaign.service';
import { environment } from '../../../environments/environment';

describe('CampaignService', () => {
  let service: CampaignService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/campaigns`;
  const token = 'test-bearer-token';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CampaignService]
    });
    service = TestBed.inject(CampaignService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCampaigns', () => {
    it('should GET /api/campaigns without params when no category given', () => {
      service.getCampaigns().subscribe();
      const req = httpMock.expectOne(`${apiUrl}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.has('category')).toBeFalse();
      req.flush([]);
    });

    it('should GET /api/campaigns?category=REFORESTATION when category provided', () => {
      service.getCampaigns('REFORESTATION').subscribe();
      const req = httpMock.expectOne(r => r.url === apiUrl && r.params.get('category') === 'REFORESTATION');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getCampaignById', () => {
    it('should GET /api/campaigns/:id', () => {
      service.getCampaignById(5).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/5`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });
  });

  describe('participateInCampaign', () => {
    it('should POST to /api/campaigns/:id/participate with Bearer header', () => {
      service.participateInCampaign(3, token).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/3/participate`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush({});
    });
  });

  describe('createCampaign', () => {
    it('should POST to /api/campaigns with Bearer header and body', () => {
      const campaign = { title: 'New campaign' };
      service.createCampaign(campaign, token).subscribe();
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      expect(req.request.body).toEqual(campaign);
      req.flush({});
    });
  });

  describe('updateCampaign', () => {
    it('should PUT to /api/campaigns/:id with Bearer header', () => {
      const update = { title: 'Updated' };
      service.updateCampaign(7, update, token).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/7`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush({});
    });
  });

  describe('deleteCampaign', () => {
    it('should DELETE /api/campaigns/:id with Bearer header', () => {
      service.deleteCampaign(2, token).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/2`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush({});
    });
  });

  describe('getMyCampaigns', () => {
    it('should GET /api/campaigns/me with Bearer header', () => {
      service.getMyCampaigns(token).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/me`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush([]);
    });
  });

  describe('getPendingCampaigns', () => {
    it('should GET /api/campaigns/pending with Bearer header', () => {
      service.getPendingCampaigns(token).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/pending`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush([]);
    });
  });

  describe('approveCampaign', () => {
    it('should PUT /api/campaigns/:id/approve with comment param', () => {
      service.approveCampaign(4, 'looks good', token).subscribe();
      const req = httpMock.expectOne(r => r.url === `${apiUrl}/4/approve` && r.params.get('comment') === 'looks good');
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush({});
    });

    it('should PUT /api/campaigns/:id/approve without comment param when undefined', () => {
      service.approveCampaign(4, undefined, token).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/4/approve`);
      expect(req.request.params.has('comment')).toBeFalse();
      req.flush({});
    });
  });

  describe('rejectCampaign', () => {
    it('should PUT /api/campaigns/:id/reject with comment param', () => {
      service.rejectCampaign(4, 'not acceptable', token).subscribe();
      const req = httpMock.expectOne(r => r.url === `${apiUrl}/4/reject` && r.params.get('comment') === 'not acceptable');
      expect(req.request.method).toBe('PUT');
      req.flush({});
    });
  });
});
