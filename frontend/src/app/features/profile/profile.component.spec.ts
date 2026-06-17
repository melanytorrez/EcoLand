import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ProfileComponent } from './profile.component';

@Pipe({ name: 'translate', standalone: false })
class FakeTranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { RecyclingService } from '../../core/services/recycling.service';
import { TranslateService } from '@ngx-translate/core';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let recyclingServiceSpy: jasmine.SpyObj<RecyclingService>;
  let router: Router;

  const mockUser: any = { id: 1, nombre: 'Maria', email: 'maria@test.com', role: 'USUARIO' as 'USUARIO', promotionStatus: 'NONE' };
  const mockParticipations: any[] = [
    { id: 1, category: 'REFORESTATION', date: '2025-03-15', spots: 10, participants: 5 },
    { id: 2, category: 'RECYCLING', date: '2025-05-10', spots: 10, participants: 5 }
  ];
  const mockRecyclingActivities: any[] = [
    { id: 1, status: 'APPROVED', registeredAt: '2025-04-01T10:00:00Z' }
  ];
  const mockBadgeSummary: any = { earnedBadges: [], progress: [] };

  const translateStub = {
    instant: (key: string) => key,
    get: () => of(''),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated', 'getUser', 'normalizeRole', 'updateUser'
    ]);
    userServiceSpy = jasmine.createSpyObj('UserService', [
      'getProfile', 'getMyParticipations', 'getMyBadges', 'requestLeaderStatus'
    ]);
    recyclingServiceSpy = jasmine.createSpyObj('RecyclingService', ['getMyRecyclingActivities']);

    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.getUser.and.returnValue(mockUser);
    authServiceSpy.normalizeRole.and.returnValue('usuario');
    userServiceSpy.getProfile.and.returnValue(of(mockUser));
    userServiceSpy.getMyParticipations.and.returnValue(of(mockParticipations));
    userServiceSpy.getMyBadges.and.returnValue(of(mockBadgeSummary));
    recyclingServiceSpy.getMyRecyclingActivities.and.returnValue(of(mockRecyclingActivities));

    await TestBed.configureTestingModule({
      declarations: [ProfileComponent, FakeTranslatePipe],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: RecyclingService, useValue: recyclingServiceSpy },
        { provide: TranslateService, useValue: translateStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should redirect to /auth/login when not authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should load profile data when authenticated', () => {
      expect(userServiceSpy.getProfile).toHaveBeenCalled();
      expect(userServiceSpy.getMyParticipations).toHaveBeenCalled();
      expect(recyclingServiceSpy.getMyRecyclingActivities).toHaveBeenCalled();
    });

    it('should set isLoading to false after data loads', () => {
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('totalActivities getter', () => {
    it('should return sum of participations and approved recycling activities', () => {
      expect(component.totalActivities).toBe(2 + 1);
    });
  });

  describe('normalizedRole getter', () => {
    it('should delegate to authService.normalizeRole', () => {
      authServiceSpy.normalizeRole.and.returnValue('lider');
      const role = component.normalizedRole;
      expect(authServiceSpy.normalizeRole).toHaveBeenCalled();
    });
  });

  describe('openPromotionModal', () => {
    it('should not open modal when promotionStatus is PENDING', () => {
      component.user = { ...mockUser, promotionStatus: 'PENDING' };
      component.openPromotionModal();
      expect(component.showPromotionModal).toBeFalse();
    });

    it('should open modal when promotionStatus is not PENDING', () => {
      component.user = { ...mockUser, promotionStatus: 'NONE' };
      component.openPromotionModal();
      expect(component.showPromotionModal).toBeTrue();
    });
  });

  describe('closePromotionModal', () => {
    it('should close the modal', () => {
      component.showPromotionModal = true;
      component.closePromotionModal();
      expect(component.showPromotionModal).toBeFalse();
    });
  });

  describe('submitPromotion', () => {
    it('should show validation errors when required fields are missing', () => {
      component.promotionForm = { motivation: '', plans: '', experience: '', commitment: '', contact: '', zone: '', organization: '', terms: false };
      component.submitPromotion();
      expect(component.showValidationErrors).toBeTrue();
      expect(userServiceSpy.requestLeaderStatus).not.toHaveBeenCalled();
    });

    it('should call requestLeaderStatus and show success modal on success', () => {
      component.user = { ...mockUser, promotionStatus: 'NONE' };
      component.promotionForm = {
        motivation: 'Quiero liderar', plans: 'Plan A', experience: 'Tengo exp',
        commitment: 'Total', contact: '123', zone: 'Norte', organization: 'Org', terms: true
      };
      userServiceSpy.requestLeaderStatus.and.returnValue(of({}));
      component.submitPromotion();
      expect(userServiceSpy.requestLeaderStatus).toHaveBeenCalled();
      expect(component.showSuccessModal).toBeTrue();
      expect(component.user.promotionStatus).toBe('PENDING');
    });
  });

  describe('calculateStats (via ngOnInit)', () => {
    it('should count reforestation participations correctly', () => {
      expect(component.reforestacionCount).toBe(1);
    });

    it('should count recycling activities correctly', () => {
      expect(component.reciclajeCount).toBe(2); // 1 RECYCLING campaign + 1 approved activity
    });
  });

  describe('generateBadges (fallback when no badge summary)', () => {
    beforeEach(() => {
      userServiceSpy.getMyBadges.and.returnValue(throwError(() => new Error('no badges')));
    });

    it('should generate ref badge when reforestacionCount >= 1', () => {
      component.participations = [{ category: 'REFORESTATION', date: '2025-01-01' }] as any;
      component.recyclingActivities = [];
      (component as any).generateBadges();
      expect(component.badges.some(b => b.code === 'ref_1')).toBeTrue();
    });

    it('should generate rec badge when reciclajeCount >= 1', () => {
      component.participations = [{ category: 'RECYCLING', date: '2025-01-01' }] as any;
      component.recyclingActivities = [];
      (component as any).generateBadges();
      expect(component.badges.some(b => b.code === 'rec_1')).toBeTrue();
    });

    it('should not generate ref badge when reforestacionCount is 0', () => {
      component.participations = [];
      component.reforestacionCount = 0;
      component.recyclingActivities = [];
      (component as any).generateBadges();
      expect(component.badges.some(b => b.code === 'ref_1')).toBeFalse();
    });
  });
});
