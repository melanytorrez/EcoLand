import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { ReforestacionComponent } from './reforestacion.component';

@Pipe({ name: 'translate', standalone: false })
class FakeTranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}
import { CampaignService } from '../../core/services/campaign.service';
import { AuthService } from '../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

describe('ReforestacionComponent', () => {
  let component: ReforestacionComponent;
  let fixture: ComponentFixture<ReforestacionComponent>;
  let campaignServiceSpy: jasmine.SpyObj<CampaignService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  const mockCampaigns: any[] = [
    { id: 1, title: 'Bosque Norte', location: 'Zona Norte', spots: 20, participants: 10 },
    { id: 2, title: 'Ríos Limpios', location: 'Zona Sur', spots: 15, participants: 5 }
  ];

  const translateStub = {
    instant: (key: string) => key,
    get: () => of(''),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

  beforeEach(async () => {
    campaignServiceSpy = jasmine.createSpyObj('CampaignService', ['getCampaigns']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    campaignServiceSpy.getCampaigns.and.returnValue(of(mockCampaigns));

    await TestBed.configureTestingModule({
      declarations: [ReforestacionComponent, FakeTranslatePipe],
      imports: [RouterTestingModule],
      providers: [
        { provide: CampaignService, useValue: campaignServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TranslateService, useValue: translateStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(ReforestacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit / loadCampaigns', () => {
    it('should load campaigns on init and set isLoading to false', () => {
      expect(component.campaigns.length).toBe(2);
      expect(component.filteredCampaigns.length).toBe(2);
      expect(component.isLoading).toBeFalse();
    });

    it('should set error message and isLoading=false on campaign load failure', () => {
      campaignServiceSpy.getCampaigns.and.returnValue(throwError(() => new Error('Network error')));
      component.loadCampaigns();
      expect(component.error).toBeTruthy();
      expect(component.isLoading).toBeFalse();
    });

    it('should clear previous error on successful reload', () => {
      component.error = 'previous error';
      component.loadCampaigns();
      expect(component.error).toBeNull();
    });
  });

  describe('filterCampaigns', () => {
    it('should filter by title case-insensitively', () => {
      component.searchTerm = 'bosque';
      component.filterCampaigns();
      expect(component.filteredCampaigns.length).toBe(1);
      expect(component.filteredCampaigns[0].id).toBe(1);
    });

    it('should filter by location case-insensitively', () => {
      component.searchTerm = 'zona sur';
      component.filterCampaigns();
      expect(component.filteredCampaigns.length).toBe(1);
      expect(component.filteredCampaigns[0].id).toBe(2);
    });

    it('should return all campaigns when searchTerm is empty', () => {
      component.searchTerm = '';
      component.filterCampaigns();
      expect(component.filteredCampaigns.length).toBe(2);
    });

    it('should return empty array when no campaign matches', () => {
      component.searchTerm = 'xyznotexist';
      component.filterCampaigns();
      expect(component.filteredCampaigns.length).toBe(0);
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate correct percentage', () => {
      expect(component.calculatePercentage(50, 200)).toBe(25);
    });

    it('should return 0 when total is 0', () => {
      expect(component.calculatePercentage(10, 0)).toBe(0);
    });

    it('should round up to nearest integer', () => {
      expect(component.calculatePercentage(1, 3)).toBe(33);
    });
  });

  describe('participate', () => {
    it('should navigate to campaign detail when authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      component.participate(1);
      expect(router.navigate).toHaveBeenCalledWith(['/reforestacion', 1]);
    });

    it('should navigate to login with redirectTo when not authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);
      component.participate(1);
      expect(router.navigate).toHaveBeenCalledWith(
        ['/login'],
        jasmine.objectContaining({ queryParams: jasmine.objectContaining({ redirectTo: '/reforestacion/1' }) })
      );
    });
  });

  describe('retry', () => {
    it('should reload campaigns', () => {
      campaignServiceSpy.getCampaigns.and.returnValue(of([]));
      component.retry();
      expect(campaignServiceSpy.getCampaigns).toHaveBeenCalledTimes(2);
    });
  });
});
