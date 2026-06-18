import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RecyclingCampaignDetailComponent } from './recycling-campaign-detail.component';

@Pipe({ name: 'translate', standalone: false })
class FakeTranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}
import { RecyclingCampaignService } from '../../core/services/recycling-campaign.service';

describe('RecyclingCampaignDetailComponent', () => {
  let component: RecyclingCampaignDetailComponent;
  let fixture: ComponentFixture<RecyclingCampaignDetailComponent>;
  let recyclingCampaignServiceSpy: jasmine.SpyObj<RecyclingCampaignService>;

  const mockCampaign: any = {
    id: 1,
    name: 'Junio sin Plástico',
    wasteType: 'Plástico',
    collected: 3240,
    goalAmount: 5000,
    status: 'Activa'
  };

  const makeRoute = (id: string | null) => ({
    snapshot: {
      paramMap: { get: (key: string) => (key === 'id' ? id : null) }
    }
  });

  beforeEach(async () => {
    recyclingCampaignServiceSpy = jasmine.createSpyObj('RecyclingCampaignService', ['getCampaignById']);
    recyclingCampaignServiceSpy.getCampaignById.and.returnValue(of(mockCampaign));

    await TestBed.configureTestingModule({
      declarations: [RecyclingCampaignDetailComponent, FakeTranslatePipe],
      providers: [
        { provide: RecyclingCampaignService, useValue: recyclingCampaignServiceSpy },
        { provide: ActivatedRoute, useValue: makeRoute('1') }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RecyclingCampaignDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load campaign by id from route', () => {
      expect(recyclingCampaignServiceSpy.getCampaignById).toHaveBeenCalledWith(1);
      expect(component.campaign).toEqual(mockCampaign);
    });

    it('should calculate percentage from collected/goalAmount', () => {
      expect(component.percentage).toBe(Math.round((3240 / 5000) * 100));
    });

    it('should calculate toCollect as goalAmount - collected', () => {
      expect(component.toCollect).toBe(5000 - 3240);
    });

    it('should not call service when id param is null', () => {
      recyclingCampaignServiceSpy.getCampaignById.calls.reset();
      const route = TestBed.inject(ActivatedRoute);
      (route.snapshot.paramMap as any).get = (_: string) => null;
      component.ngOnInit();
      expect(recyclingCampaignServiceSpy.getCampaignById).not.toHaveBeenCalled();
    });
  });
});
