import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecyclingCampaignDetailComponent } from './recycling-campaign-detail.component';

describe('RecyclingCampaignDetailComponent', () => {
  let component: RecyclingCampaignDetailComponent;
  let fixture: ComponentFixture<RecyclingCampaignDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecyclingCampaignDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecyclingCampaignDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
