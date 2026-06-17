import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { of, throwError } from 'rxjs';

import { HomeComponent } from './home.component';

@Pipe({ name: 'translate', standalone: false })
class FakeTranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}
import { CampaignService } from '../../core/services/campaign.service';
import { StatisticsService } from '../../core/services/statistics.service';
import { FeatureFlagService } from '../../core/services/feature-flag.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let campaignServiceSpy: jasmine.SpyObj<CampaignService>;
  let statisticsServiceSpy: jasmine.SpyObj<StatisticsService>;
  let featureFlagServiceSpy: jasmine.SpyObj<FeatureFlagService>;

  const mockCampaigns = [
    { id: 1, title: 'C1', spots: 10, participants: 5 },
    { id: 2, title: 'C2', spots: 10, participants: 3 },
    { id: 3, title: 'C3', spots: 10, participants: 7 },
    { id: 4, title: 'C4', spots: 10, participants: 2 }
  ] as any[];

  const mockStats = { activeCampaigns: 5, totalParticipants: 100, totalCampaigns: 20 };

  const translateStub = {
    instant: (key: string) => key,
    get: (key: string) => of(key),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

  beforeEach(async () => {
    campaignServiceSpy = jasmine.createSpyObj('CampaignService', ['getCampaigns']);
    statisticsServiceSpy = jasmine.createSpyObj('StatisticsService', ['getQuickStats']);
    featureFlagServiceSpy = jasmine.createSpyObj('FeatureFlagService', ['isFeatureEnabled']);
    featureFlagServiceSpy.isFeatureEnabled.and.returnValue(true);

    campaignServiceSpy.getCampaigns.and.returnValue(of(mockCampaigns));
    statisticsServiceSpy.getQuickStats.and.returnValue(of(mockStats));

    await TestBed.configureTestingModule({
      declarations: [HomeComponent, FakeTranslatePipe],
      providers: [
        { provide: CampaignService, useValue: campaignServiceSpy },
        { provide: StatisticsService, useValue: statisticsServiceSpy },
        { provide: FeatureFlagService, useValue: featureFlagServiceSpy },
        { provide: TranslateService, useValue: translateStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit - campaigns', () => {
    it('should load campaigns and slice to first 3', () => {
      expect(component.campaigns.length).toBe(3);
      expect(component.isLoadingCampaigns).toBeFalse();
    });

    it('should set campaigns to [] when service errors', () => {
      campaignServiceSpy.getCampaigns.and.returnValue(throwError(() => new Error('fail')));
      component.ngOnInit();
      expect(component.campaigns).toEqual([]);
      expect(component.isLoadingCampaigns).toBeFalse();
    });
  });

  describe('ngOnInit - stats', () => {
    it('should update stats values from service response', () => {
      expect(component.stats[0].value).toBe('5');
      expect(component.stats[1].value).toBe('100');
      expect(component.stats[2].value).toBe('20');
      expect(component.isLoadingStats).toBeFalse();
    });

    it('should set isLoadingStats=false on stats error', () => {
      statisticsServiceSpy.getQuickStats.and.returnValue(throwError(() => new Error('fail')));
      component.ngOnInit();
      expect(component.isLoadingStats).toBeFalse();
    });

    it('should keep default "..." values when stats errors', () => {
      component.stats = component.stats.map(s => ({ ...s, value: '...' }));
      statisticsServiceSpy.getQuickStats.and.returnValue(throwError(() => new Error('fail')));
      component.ngOnInit();
      expect(component.stats[0].value).toBe('...');
    });
  });

  describe('getSpotCount', () => {
    it('should return string version of number', () => {
      expect(component.getSpotCount(5)).toBe('5');
      expect(component.getSpotCount(0)).toBe('0');
    });
  });

  describe('isFeatureEnabled', () => {
    it('should delegate to featureFlagService', () => {
      featureFlagServiceSpy.isFeatureEnabled.and.returnValue(false);
      expect(component.isFeatureEnabled('reciclaje')).toBeFalse();
      expect(featureFlagServiceSpy.isFeatureEnabled).toHaveBeenCalledWith('reciclaje');
    });
  });
});
