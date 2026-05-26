import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { CampaignDetailComponent } from './campaign-detail.component';

describe('CampaignDetailComponent', () => {
  let component: CampaignDetailComponent;
  let fixture: ComponentFixture<CampaignDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CampaignDetailComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
