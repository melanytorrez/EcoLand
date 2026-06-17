import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { RecyclingService } from '../../core/services/recycling.service';
import { Campaign } from '../../core/models/campaign.model';
import { User } from '../../core/models/user.model';
import { BadgeType, UserBadgeSummary } from '../../core/models/badge.model';
import { RecyclingActivity } from '../../core/models/recycling.model';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

interface Badge {
  id: string;
  code: string;
  type: BadgeType;
  titleKey: string;
  descriptionKey: string;
  earnedDate: string;
  iconName: string;
}

interface BadgeProgressView {
  code: string;
  type: BadgeType;
  titleKey: string;
  descriptionKey: string;
  current: number;
  target: number;
  percentage: number;
  iconName: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: false
})
export class ProfileComponent implements OnInit {
  @ViewChild('formBody') formBody!: ElementRef;
  
  user: User | any = null;
  participations: Campaign[] = [];
  recyclingActivities: RecyclingActivity[] = [];
  isLoading = true;
  
  reforestacionCount = 0;
  reciclajeCount = 0;
  badges: Badge[] = [];
  badgeProgress: BadgeProgressView[] = [];
  private badgeSummary: UserBadgeSummary | null = null;
  
  showPromotionModal = false;
  isSubmitting = false;
  showValidationErrors = false;
  showSuccessModal = false;
  promotionForm = {
    motivation: '',
    plans: '',
    experience: '',
    commitment: '',
    contact: '',
    zone: '',
    organization: '',
    terms: false
  };

  // Pie Chart
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' }
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Reforestación', 'Reciclaje'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#2E7D32', '#4CAF50']
    }]
  };
  public pieChartType: ChartType = 'pie';

  // Bar Chart
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: { min: 0, ticks: { stepSize: 1 } }
    },
    plugins: {
      legend: { display: true, position: 'bottom' }
    }
  };
  public barChartData: ChartData<'bar'> = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      { data: Array(12).fill(0), label: 'Reforestación', backgroundColor: '#2E7D32' },
      { data: Array(12).fill(0), label: 'Reciclaje', backgroundColor: '#4CAF50' }
    ]
  };
  public barChartType: ChartType = 'bar';

  get currentYear(): number {
    return new Date().getFullYear();
  }

  get totalActivities(): number {
    return this.participations.length + this.recyclingActivities.length;
  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private recyclingService: RecyclingService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.user = this.authService.getUser() || {};

    this.translate.onLangChange.subscribe(() => {
      this.updateChartLabels();
      this.cdr.detectChanges();
    });

    this.loadProfileData();
  }

  private loadProfileData(): void {
    this.isLoading = true;

    forkJoin({
      profile: this.userService.getProfile().pipe(catchError(err => {
        console.error('Error fetching full profile', err);
        return of(null);
      })),
      participations: this.userService.getMyParticipations().pipe(catchError(err => {
        console.error('Error fetching participations', err);
        return of([] as Campaign[]);
      })),
      recyclingActivities: this.recyclingService.getMyRecyclingActivities().pipe(catchError(err => {
        console.error('Error fetching recycling activities', err);
        return of([] as RecyclingActivity[]);
      })),
      badgeSummary: this.userService.getMyBadges().pipe(catchError(err => {
        console.error('Error fetching badges', err);
        return of(null);
      }))
    })
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: ({ profile, participations, recyclingActivities, badgeSummary }) => {
          if (profile) {
            this.applyProfile(profile);
          }

          this.participations = participations;
          this.recyclingActivities = recyclingActivities.filter(activity => activity.status === 'APPROVED');
          this.badgeSummary = badgeSummary;
          this.calculateStats();

          if (this.badgeSummary) {
            this.applyBadgeSummary(this.badgeSummary);
          } else {
            this.generateBadges();
          }

          this.cdr.detectChanges();
        }
      });
  }

  private applyProfile(profile: any): void {
    const resolvedRole = profile.role ||
      (profile.roles && profile.roles.length > 0 ? (profile.roles[0].nombre || profile.roles[0].name) : null) ||
      this.user?.role;

    this.user = {
      ...this.user,
      ...profile,
      role: resolvedRole,
      promotionStatus: profile.estadoSolicitud || profile.promotionStatus || this.user?.promotionStatus
    };
    this.authService.updateUser(this.user);
  }

  openPromotionModal(): void {
    if (this.user.promotionStatus === 'PENDING') return;
    this.showPromotionModal = true;
    this.showValidationErrors = false; // Reset errors when opening
    this.cdr.detectChanges();
  }

  closePromotionModal(): void {
    this.showPromotionModal = false;
    this.showValidationErrors = false;
    this.cdr.detectChanges();
  }

  submitPromotion(): void {
    if (!this.promotionForm.terms || !this.promotionForm.motivation || !this.promotionForm.plans || 
        !this.promotionForm.experience || !this.promotionForm.commitment || !this.promotionForm.zone) {
      this.showValidationErrors = true;
      this.cdr.detectChanges();
      
      // Auto-scroll to bottom to show error message
      if (this.formBody) {
        setTimeout(() => {
          this.formBody.nativeElement.scrollTo({
            top: this.formBody.nativeElement.scrollHeight,
            behavior: 'smooth'
          });
        }, 100);
      }
      return;
    }

    this.isSubmitting = true;
    this.showValidationErrors = false;
    this.userService.requestLeaderStatus(this.promotionForm).subscribe({
      next: () => {
        this.user.promotionStatus = 'PENDING';
        this.authService.updateUser(this.user); // Persist status
        this.showPromotionModal = false;
        this.isSubmitting = false;
        this.showSuccessModal = true; 
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error requesting promotion', err);
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  get normalizedRole(): string {
    return this.authService.normalizeRole(this.user?.role);
  }

  private updateChartLabels(): void {
    // Only update if we have data initialized
    if (this.pieChartData && this.barChartData) {
      this.pieChartData = {
        ...this.pieChartData,
        labels: [
          this.translate.instant('profile.stats.reforestation'),
          this.translate.instant('profile.stats.recycling')
        ]
      };

      this.barChartData = {
        ...this.barChartData,
        datasets: [
          { ...this.barChartData.datasets[0], label: this.translate.instant('profile.stats.reforestation') },
          { ...this.barChartData.datasets[1], label: this.translate.instant('profile.stats.recycling') }
        ]
      };
      
    }
  }

  private loadBadgeSummary(): void {
    this.userService.getMyBadges().subscribe({
      next: (summary) => {
        this.badgeSummary = summary;
        this.applyBadgeSummary(summary);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching badges', err);
        this.badgeSummary = null;
        this.generateBadges();
        this.cdr.detectChanges();
      }
    });
  }

  private loadRecyclingActivities(): void {
    this.recyclingService.getMyRecyclingActivities().subscribe({
      next: (activities) => {
        this.recyclingActivities = activities.filter(activity => activity.status === 'APPROVED');
        this.calculateStats();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching recycling activities', err);
        this.recyclingActivities = [];
        this.calculateStats();
        this.cdr.detectChanges();
      }
    });
  }

  private applyBadgeSummary(summary: UserBadgeSummary): void {
    this.badges = (summary.earnedBadges || []).map(badge => ({
      id: String(badge.id ?? badge.code),
      code: badge.code,
      type: this.normalizeBadgeType(badge.type),
      titleKey: badge.titleKey,
      descriptionKey: badge.descriptionKey,
      earnedDate: badge.earnedAt,
      iconName: badge.iconName
    }));

    this.badgeProgress = (summary.progress || [])
      .filter(progress => !progress.earned)
      .map(progress => ({
        code: progress.code,
        type: this.normalizeBadgeType(progress.type),
        titleKey: progress.titleKey,
        descriptionKey: progress.descriptionKey,
        current: progress.current,
        target: progress.target,
        percentage: progress.percentage,
        iconName: progress.iconName
      }));
  }

  private normalizeBadgeType(type: string | undefined): BadgeType {
    if (type === 'reciclaje') {
      return 'reciclaje';
    }
    if (type === 'general') {
      return 'general';
    }
    return 'reforestacion';
  }

  private calculateStats(): void {
    this.reforestacionCount = this.participations.filter(c => c.category === 'REFORESTATION').length;
    this.reciclajeCount = this.participations.filter(c => c.category === 'RECYCLING').length + this.recyclingActivities.length;

    this.pieChartData.datasets[0].data = [this.reforestacionCount, this.reciclajeCount];
    
    const refData = Array(12).fill(0);
    const recData = Array(12).fill(0);
    
    this.participations.forEach(c => {
      if (c.date) {
        const dateParts = c.date.split('-');
        if (dateParts.length >= 2) {
          const monthIndex = parseInt(dateParts[1], 10) - 1;
          if (monthIndex >= 0 && monthIndex < 12) {
            if (c.category === 'REFORESTATION') {
              refData[monthIndex]++;
            } else if (c.category === 'RECYCLING') {
              recData[monthIndex]++;
            }
          }
        }
      }
    });

    this.recyclingActivities.forEach(activity => {
      if (activity.registeredAt) {
        const date = new Date(activity.registeredAt);
        const monthIndex = date.getMonth();
        if (!Number.isNaN(monthIndex) && monthIndex >= 0 && monthIndex < 12) {
          recData[monthIndex]++;
        }
      }
    });

    this.updateChartLabels();

    this.pieChartData = {
      ...this.pieChartData,
      datasets: [{
        ...this.pieChartData.datasets[0],
        data: [this.reforestacionCount, this.reciclajeCount]
      }]
    };
    
    this.barChartData = {
      ...this.barChartData,
      datasets: [
        { ...this.barChartData.datasets[0], data: refData },
        { ...this.barChartData.datasets[1], data: recData }
      ]
    };
  }

  private generateBadges(): void {
    const newBadges: Badge[] = [];
    
    if (this.reforestacionCount >= 1) {
      newBadges.push({
        id: 'ref-1', code: 'ref_1', type: 'reforestacion',
        titleKey: 'profile.badges.list.ref_1.title',
        descriptionKey: 'profile.badges.list.ref_1.description',
        earnedDate: new Date().toISOString(), iconName: 'tree-pine'
      });
    }
    if (this.reforestacionCount >= 5) {
      newBadges.push({
        id: 'ref-5', code: 'ref_5', type: 'reforestacion',
        titleKey: 'profile.badges.list.ref_5.title',
        descriptionKey: 'profile.badges.list.ref_5.description',
        earnedDate: new Date().toISOString(), iconName: 'tree-pine'
      });
    }

    if (this.reciclajeCount >= 1) {
      newBadges.push({
        id: 'rec-1', code: 'rec_1', type: 'reciclaje',
        titleKey: 'profile.badges.list.rec_1.title',
        descriptionKey: 'profile.badges.list.rec_1.description',
        earnedDate: new Date().toISOString(), iconName: 'recycle'
      });
    }
    if (this.reciclajeCount >= 5) {
      newBadges.push({
        id: 'rec-5', code: 'rec_5', type: 'reciclaje',
        titleKey: 'profile.badges.list.rec_5.title',
        descriptionKey: 'profile.badges.list.rec_5.description',
        earnedDate: new Date().toISOString(), iconName: 'recycle'
      });
    }

    if ((this.participations.length + this.recyclingActivities.length) >= 10) {
      newBadges.push({
        id: 'gen-10', code: 'gen_10', type: 'general',
        titleKey: 'profile.badges.list.gen_10.title',
        descriptionKey: 'profile.badges.list.gen_10.description',
        earnedDate: new Date().toISOString(), iconName: 'award'
      });
    }

    this.badges = newBadges;
    this.badgeProgress = [];
  }
}
