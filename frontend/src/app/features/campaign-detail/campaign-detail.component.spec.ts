import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CampaignDetailComponent } from './campaign-detail.component';

@Pipe({ name: 'translate', standalone: false })
class FakeTranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}
import { CampaignService } from '../../core/services/campaign.service';
import { AuthService } from '../../core/services/auth.service';
import { VolunteerApplicationService } from '../../core/services/volunteer-application.service';
import { TranslateService } from '@ngx-translate/core';

describe('CampaignDetailComponent (features/campaign-detail)', () => {
  let component: CampaignDetailComponent;
  let fixture: ComponentFixture<CampaignDetailComponent>;
  let campaignServiceSpy: jasmine.SpyObj<CampaignService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let volunteerServiceSpy: jasmine.SpyObj<VolunteerApplicationService>;
  let router: Router;

  const mockCampaign: any = { id: 1, title: 'Campaign One', spots: 20, participants: 10 };

  const translateStub = {
    instant: (key: string) => key,
    get: () => of(''),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

  const makeRoute = (id: string | null) => ({
    paramMap: of(convertToParamMap(id ? { id } : {})),
    snapshot: { paramMap: { get: () => id } }
  });

  beforeEach(async () => {
    campaignServiceSpy = jasmine.createSpyObj('CampaignService', ['getCampaignById', 'participateInCampaign']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getToken']);
    volunteerServiceSpy = jasmine.createSpyObj('VolunteerApplicationService', ['getMyApplication']);

    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.getToken.and.returnValue('tok');
    campaignServiceSpy.getCampaignById.and.returnValue(of(mockCampaign));
    volunteerServiceSpy.getMyApplication.and.returnValue(throwError(() => ({ status: 404 })));

    await TestBed.configureTestingModule({
      declarations: [CampaignDetailComponent, FakeTranslatePipe],
      imports: [RouterTestingModule],
      providers: [
        { provide: CampaignService, useValue: campaignServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: VolunteerApplicationService, useValue: volunteerServiceSpy },
        { provide: ActivatedRoute, useValue: makeRoute('1') },
        { provide: TranslateService, useValue: translateStub }
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
      expect(component.campaign).toEqual(mockCampaign);
      expect(component.isLoading).toBeFalse();
    });

    it('should calculate percentage and availableSpots', () => {
      expect(component.percentage).toBe(Math.round((10 / 20) * 100));
      expect(component.availableSpots).toBe(10);
    });

    it('should set errorMessage when campaign load fails', async () => {
      campaignServiceSpy.getCampaignById.and.returnValue(throwError(() => new Error('fail')));
      component.ngOnInit();
      expect(component.errorMessage).toBeTruthy();
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('participate', () => {
    it('should navigate to login when not authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);
      component.participate();
      expect(router.navigate).toHaveBeenCalledWith(['/login'], jasmine.any(Object));
    });

    it('should call participateInCampaign when authenticated', () => {
      campaignServiceSpy.participateInCampaign.and.returnValue(of({ ...mockCampaign, participants: 11 }));
      component.participate();
      expect(campaignServiceSpy.participateInCampaign).toHaveBeenCalledWith(1, 'tok');
    });

    it('should update campaign data on participation success', () => {
      const updatedCampaign = { ...mockCampaign, participants: 11 };
      campaignServiceSpy.participateInCampaign.and.returnValue(of(updatedCampaign));
      component.participate();
      expect(component.campaign).toEqual(updatedCampaign);
      expect(component.participationMessage).toBeTruthy();
    });

    it('should set participationError on failure', () => {
      campaignServiceSpy.participateInCampaign.and.returnValue(throwError(() => ({ error: 'No spots available' })));
      component.participate();
      expect(component.participationError).toBe('No spots available');
    });
  });

  describe('goToVolunteerApplication', () => {
    it('should navigate to login when not authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);
      component.goToVolunteerApplication();
      expect(router.navigate).toHaveBeenCalledWith(
        ['/login'],
        jasmine.objectContaining({ queryParams: { redirectTo: '/reforestacion/1/postular' } })
      );
    });

    it('should navigate to volunteer application when authenticated', () => {
      component.goToVolunteerApplication();
      expect(router.navigate).toHaveBeenCalledWith(
        ['/reforestacion', 1, 'postular'],
        jasmine.any(Object)
      );
    });
  });
});
