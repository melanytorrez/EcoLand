import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CampaignDetailComponent } from './campaign-detail.component';
import { CampaignService } from '../../../../../core/services/campaign.service';
import { AuthService } from '../../../../../core/services/auth.service';

describe('CampaignDetailComponent (campaigns/pages/user)', () => {
  let component: CampaignDetailComponent;
  let fixture: ComponentFixture<CampaignDetailComponent>;
  let campaignServiceSpy: jasmine.SpyObj<CampaignService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  const mockCampaign: any = { id: 3, title: 'Green Forest', spots: 30, participants: 15 };

  const mockActivatedRoute = {
    paramMap: of(convertToParamMap({ id: '3' })),
    snapshot: { paramMap: { get: () => '3' } }
  };

  beforeEach(async () => {
    campaignServiceSpy = jasmine.createSpyObj('CampaignService', ['getCampaignById']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);

    campaignServiceSpy.getCampaignById.and.returnValue(of(mockCampaign));
    authServiceSpy.isAuthenticated.and.returnValue(true);

    await TestBed.configureTestingModule({
      declarations: [CampaignDetailComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: CampaignService, useValue: campaignServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(CampaignDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load campaign by id', () => {
      expect(campaignServiceSpy.getCampaignById).toHaveBeenCalledWith(3);
      expect(component.campaign).toEqual(mockCampaign);
    });

    it('should calculate percentage correctly', () => {
      expect(component.percentage).toBe(Math.round((15 / 30) * 100));
    });

    it('should calculate availableSpots correctly', () => {
      expect(component.availableSpots).toBe(15);
    });
  });

  describe('goToVolunteerApplication', () => {
    it('should navigate to login when not authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);
      component.goToVolunteerApplication();
      expect(router.navigate).toHaveBeenCalledWith(
        ['/login'],
        jasmine.objectContaining({ queryParams: { redirectTo: '/reforestacion/3/postular' } })
      );
    });

    it('should navigate to postular page when authenticated', () => {
      component.goToVolunteerApplication();
      expect(router.navigate).toHaveBeenCalledWith(
        ['/reforestacion', 3, 'postular'],
        jasmine.any(Object)
      );
    });

    it('should do nothing when campaign is not loaded', () => {
      component.campaign = undefined;
      component.goToVolunteerApplication();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
