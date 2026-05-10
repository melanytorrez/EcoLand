import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { Campaign } from '../../core/models/campaign.model';
import { User } from '../../core/models/user.model';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';

interface Badge {
  id: string;
  type: 'reforestacion' | 'reciclaje' | 'general';
  title: string;
  description: string;
  earnedDate: string;
  iconName: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: false
})
export class ProfileComponent implements OnInit {
  user: User | any = null;
  participations: Campaign[] = [];
  isLoading = true;
  
  reforestacionCount = 0;
  reciclajeCount = 0;
  badges: Badge[] = [];
  
  showPromotionModal = false;
  isSubmitting = false;
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

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.user = this.authService.getUser();
    
    // Fetch full profile to get promotion status and actual role from DB
    this.userService.getProfile().subscribe({
      next: (profile) => {
        console.log('User Profile loaded:', profile);
        this.user = { ...this.user, ...profile };
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching full profile', err)
    });

    this.translate.onLangChange.subscribe(() => {
      this.updateChartLabels();
      this.cdr.detectChanges();
    });

    this.userService.getMyParticipations()
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (campaigns) => {
          this.participations = campaigns;
          this.calculateStats();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching participations', err);
          this.cdr.detectChanges();
        }
      });
  }

  openPromotionModal(): void {
    if (this.user.promotionStatus === 'PENDING') return;
    this.showPromotionModal = true;
    this.cdr.detectChanges();
  }

  closePromotionModal(): void {
    this.showPromotionModal = false;
    this.cdr.detectChanges();
  }

  submitPromotion(): void {
    if (!this.promotionForm.terms || !this.promotionForm.motivation || !this.promotionForm.plans) {
      alert(this.translate.instant('profile.promotion.modal.validation_error'));
      return;
    }

    this.isSubmitting = true;
    this.userService.requestLeaderStatus(this.promotionForm).subscribe({
      next: () => {
        this.user.promotionStatus = 'PENDING';
        this.showPromotionModal = false;
        this.isSubmitting = false;
        alert(this.translate.instant('profile.promotion.modal.success_message'));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error requesting promotion', err);
        this.isSubmitting = false;
        alert(this.translate.instant('profile.promotion.modal.error_message'));
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
      
      this.generateBadges(); // Refresh badge translations
    }
  }

  private calculateStats(): void {
    this.reforestacionCount = this.participations.filter(c => c.category === 'REFORESTATION').length;
    this.reciclajeCount = this.participations.filter(c => c.category === 'RECYCLING').length;

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
        id: 'ref-1', type: 'reforestacion',
        title: this.translate.instant('profile.badges.list.ref_1.title'),
        description: this.translate.instant('profile.badges.list.ref_1.description'),
        earnedDate: new Date().toISOString(), iconName: 'tree-pine'
      });
    }
    if (this.reforestacionCount >= 5) {
      newBadges.push({
        id: 'ref-5', type: 'reforestacion',
        title: this.translate.instant('profile.badges.list.ref_5.title'),
        description: this.translate.instant('profile.badges.list.ref_5.description'),
        earnedDate: new Date().toISOString(), iconName: 'tree-pine'
      });
    }

    if (this.reciclajeCount >= 1) {
      newBadges.push({
        id: 'rec-1', type: 'reciclaje',
        title: this.translate.instant('profile.badges.list.rec_1.title'),
        description: this.translate.instant('profile.badges.list.rec_1.description'),
        earnedDate: new Date().toISOString(), iconName: 'trash-2'
      });
    }
    if (this.reciclajeCount >= 5) {
      newBadges.push({
        id: 'rec-5', type: 'reciclaje',
        title: this.translate.instant('profile.badges.list.rec_5.title'),
        description: this.translate.instant('profile.badges.list.rec_5.description'),
        earnedDate: new Date().toISOString(), iconName: 'trash-2'
      });
    }

    if (this.participations.length >= 10) {
      newBadges.push({
        id: 'gen-10', type: 'general',
        title: this.translate.instant('profile.badges.list.gen_10.title'),
        description: this.translate.instant('profile.badges.list.gen_10.description'),
        earnedDate: new Date().toISOString(), iconName: 'award'
      });
    }

    this.badges = newBadges;
  }
}
