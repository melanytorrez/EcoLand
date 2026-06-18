import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Pipe({ name: 'translate', standalone: false })
class FakeTranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';

import { VolunteerApplicationComponent } from './volunteer-application.component';
import { CampaignService } from '../../core/services/campaign.service';
import { VolunteerApplicationService } from '../../core/services/volunteer-application.service';
import { AuthService } from '../../core/services/auth.service';

describe('VolunteerApplicationComponent', () => {
  let component: VolunteerApplicationComponent;
  let fixture: ComponentFixture<VolunteerApplicationComponent>;
  let campaignServiceSpy: jasmine.SpyObj<CampaignService>;
  let volunteerServiceSpy: jasmine.SpyObj<VolunteerApplicationService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  const mockCampaign: any = { id: 5, title: 'Bosque Verde', spots: 20, participants: 10 };

  const mockActivatedRoute = {
    snapshot: {},
    paramMap: of(convertToParamMap({ campaignId: '5' }))
  };

  beforeEach(async () => {
    campaignServiceSpy = jasmine.createSpyObj('CampaignService', ['getCampaignById']);
    volunteerServiceSpy = jasmine.createSpyObj('VolunteerApplicationService', ['apply', 'getMyApplication']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser', 'isAuthenticated']);

    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.getUser.and.returnValue({ nombre: 'Test User' });
    campaignServiceSpy.getCampaignById.and.returnValue(of(mockCampaign));
    volunteerServiceSpy.getMyApplication.and.returnValue(throwError(() => ({ status: 404 })));

    await TestBed.configureTestingModule({
      declarations: [VolunteerApplicationComponent, FakeTranslatePipe],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: CampaignService, useValue: campaignServiceSpy },
        { provide: VolunteerApplicationService, useValue: volunteerServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(VolunteerApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should build form with all required controls', () => {
      expect(component.form.get('fullName')).toBeTruthy();
      expect(component.form.get('age')).toBeTruthy();
      expect(component.form.get('phone')).toBeTruthy();
      expect(component.form.get('motivation')).toBeTruthy();
      expect(component.form.get('availabilityHours')).toBeTruthy();
    });
  });

  describe('isFieldInvalid', () => {
    it('should return false before submit attempt', () => {
      component.submitAttempted = false;
      expect(component.isFieldInvalid('fullName')).toBeFalse();
    });

    it('should return true for invalid field after submitAttempted=true', () => {
      component.submitAttempted = true;
      component.form.get('fullName')!.setValue('');
      expect(component.isFieldInvalid('fullName')).toBeTrue();
    });
  });

  describe('getFieldError', () => {
    it('should return required message when field has required error', () => {
      component.form.get('fullName')!.setValue('');
      component.form.get('fullName')!.markAsTouched();
      expect(component.getFieldError('fullName')).toContain('obligatorio');
    });

    it('should return minlength message when field value is too short', () => {
      component.form.get('fullName')!.setValue('ab');
      component.form.get('fullName')!.markAsTouched();
      expect(component.getFieldError('fullName')).toContain('al menos');
    });

    it('should return age error when age is below minimum', () => {
      component.form.get('age')!.setValue(15);
      component.form.get('age')!.markAsTouched();
      expect(component.getFieldError('age')).toContain('mayor de edad');
    });
  });

  describe('submit', () => {
    it('should set errorMessage when campaignId is null', () => {
      component.campaignId = null;
      component.submit();
      expect(component.errorMessage).toBeTruthy();
    });

    it('should navigate to login when not authenticated', () => {
      component.campaignId = 5;
      authServiceSpy.isAuthenticated.and.returnValue(false);
      component.submit();
      expect(router.navigate).toHaveBeenCalledWith(
        ['/login'],
        jasmine.objectContaining({ queryParams: jasmine.any(Object) })
      );
    });

    it('should set duplicate error when application already exists', () => {
      component.campaignId = 5;
      component.existingApplicationStatus = 'PENDING';
      component.submit();
      expect(component.errorMessage).toBeTruthy();
    });

    it('should mark all touched and set validation summary when form invalid', () => {
      component.campaignId = 5;
      component.form.get('fullName')!.setValue('');
      spyOn(component.form, 'markAllAsTouched');
      component.submit();
      expect(component.form.markAllAsTouched).toHaveBeenCalled();
    });

    it('should call apply service on valid form and set success state', () => {
      component.campaignId = 5;
      component.existingApplicationStatus = null;
      component.form.setValue({
        fullName: 'Test User',
        age: 25,
        phone: '1234567',
        availableWeekends: true,
        hasEnvironmentalExperience: false,
        experienceDetails: '',
        motivation: 'I really want to participate in this campaign',
        availabilityHours: 'Full time'
      });
      volunteerServiceSpy.apply.and.returnValue(of({} as any));
      component.submit();
      expect(volunteerServiceSpy.apply).toHaveBeenCalled();
      expect(component.existingApplicationStatus as unknown as string).toBe('PENDING');
      expect(component.showSubmittedMessage).toBeTrue();
    });

    it('should show server error message on apply failure', () => {
      component.campaignId = 5;
      component.existingApplicationStatus = null;
      component.form.setValue({
        fullName: 'Test User',
        age: 25,
        phone: '1234567',
        availableWeekends: true,
        hasEnvironmentalExperience: false,
        experienceDetails: '',
        motivation: 'I really want to participate in this campaign',
        availabilityHours: 'Full time'
      });
      volunteerServiceSpy.apply.and.returnValue(throwError(() => ({ error: { message: 'Ya aplicaste' } })));
      component.submit();
      expect(component.errorMessage).toBe('Ya aplicaste');
    });
  });

  describe('goBack', () => {
    it('should navigate to /reforestacion/:campaignId', () => {
      component.campaignId = 5;
      component.goBack();
      expect(router.navigate).toHaveBeenCalledWith(['/reforestacion', 5]);
    });
  });

  describe('getExistingApplicationMessage', () => {
    it('should return PENDING message', () => {
      component.existingApplicationStatus = 'PENDING';
      (component as any).existingApplicationMessage = (component as any).computeExistingApplicationMessage();
      expect(component.getExistingApplicationMessage()).toContain('pendiente');
    });

    it('should return ACCEPTED message', () => {
      component.existingApplicationStatus = 'ACCEPTED';
      (component as any).existingApplicationMessage = (component as any).computeExistingApplicationMessage();
      expect(component.getExistingApplicationMessage()).toContain('aceptada');
    });

    it('should return REJECTED message', () => {
      component.existingApplicationStatus = 'REJECTED';
      (component as any).existingApplicationMessage = (component as any).computeExistingApplicationMessage();
      expect(component.getExistingApplicationMessage()).toContain('rechazada');
    });
  });
});
