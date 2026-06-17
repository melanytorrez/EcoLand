import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { of, throwError } from 'rxjs';

import { StatisticsComponent } from './statistics.component';

@Pipe({ name: 'translate', standalone: false })
class FakeTranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}
import { StatisticsService, ComprehensiveStatistics } from '../../core/services/statistics.service';
import { TranslateService } from '@ngx-translate/core';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  let statisticsServiceSpy: jasmine.SpyObj<StatisticsService>;

  const mockComprehensive: ComprehensiveStatistics = {
    totalCampaigns: 20,
    activeCampaigns: 5,
    totalParticipants: 300,
    completedCampaigns: 15,
    plantedTrees: 5000,
    mitigatedCo2Kg: 12000,
    monthlyPlantedTrees: [{ month: 'Ene', value: 100 }, { month: 'Feb', value: 200 }],
    residueDistribution: [{ type: 'Plástico', amount: 400 }],
    zoneActivity: [{ zone: 'Norte', activities: 30 }],
    volunteerGrowth: [{ month: 'Ene', totalVolunteers: 50 }],
    waterSavedLiters: 2000000,
    forestAreaHectares: 120
  };

  const translateStub = {
    instant: (key: string, params?: any) => key,
    get: (key: string) => of(key),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

  beforeEach(async () => {
    statisticsServiceSpy = jasmine.createSpyObj('StatisticsService', [
      'getComprehensiveStatistics', 'getCampaignParticipants'
    ]);
    statisticsServiceSpy.getComprehensiveStatistics.and.returnValue(of(mockComprehensive));
    statisticsServiceSpy.getCampaignParticipants.and.returnValue(of([
      { id: 1, title: 'Camp A', image: '', date: '', location: '', spots: 10, participants: 20, organizer: '', status: 'APPROVED', category: 'REFORESTATION' } as any
    ]));

    await TestBed.configureTestingModule({
      declarations: [StatisticsComponent, FakeTranslatePipe],
      providers: [
        { provide: StatisticsService, useValue: statisticsServiceSpy },
        { provide: TranslateService, useValue: translateStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getComprehensiveStatistics and getCampaignParticipants', () => {
      expect(statisticsServiceSpy.getComprehensiveStatistics).toHaveBeenCalled();
      expect(statisticsServiceSpy.getCampaignParticipants).toHaveBeenCalled();
    });

    it('should set data and isLoading=false on success', () => {
      expect(component.data).toEqual(mockComprehensive);
      expect(component.isLoading).toBeFalse();
    });

    it('should use default data when comprehensive stats fails', () => {
      statisticsServiceSpy.getComprehensiveStatistics.and.returnValue(
        throwError(() => new Error('API error'))
      );
      component.ngOnInit();
      expect(component.isLoading).toBeFalse();
      expect(component.data).toBeDefined();
    });
  });

  describe('getDefaultComprehensiveData (via fallback)', () => {
    it('should produce zeroed stats when service fails', () => {
      statisticsServiceSpy.getComprehensiveStatistics.and.returnValue(
        throwError(() => new Error('fail'))
      );
      component.ngOnInit();
      expect(component.data!.totalCampaigns).toBe(0);
      expect(component.data!.plantedTrees).toBe(0);
      expect(component.data!.monthlyPlantedTrees).toEqual([]);
    });
  });

  describe('chart data population', () => {
    it('should populate monthlyChartData labels from monthlyPlantedTrees', () => {
      expect(component.monthlyChartData.labels).toEqual(['Ene', 'Feb']);
    });

    it('should populate monthlyChartData values from monthlyPlantedTrees', () => {
      expect(component.monthlyChartData.datasets[0].data).toEqual([100, 200]);
    });

    it('should populate residueChartData labels from residueDistribution', () => {
      expect(component.residueChartData.labels).toContain('Plástico');
    });

    it('should populate zoneChartData labels from zoneActivity', () => {
      expect(component.zoneChartData.labels).toContain('Norte');
    });

    it('should populate volunteerChartData labels from volunteerGrowth', () => {
      expect(component.volunteerChartData.labels).toContain('Ene');
    });
  });

  describe('summary cards', () => {
    it('should update summary card values after data loads', () => {
      expect(component.summaryCards[0].value).toContain('5,000');
    });
  });
});
