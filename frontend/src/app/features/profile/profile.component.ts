import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { Campaign } from '../../core/models/campaign.model';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

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
  user: any = null;
  participations: Campaign[] = [];
  
  reforestacionCount = 0;
  reciclajeCount = 0;
  badges: Badge[] = [];

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
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.user = this.authService.getUser();
    
    this.userService.getMyParticipations().subscribe({
      next: (campaigns) => {
        this.participations = campaigns;
        this.calculateStats();
      },
      error: (err) => console.error('Error fetching participations', err)
    });
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

    this.barChartData.datasets[0].data = refData;
    this.barChartData.datasets[1].data = recData;

    this.generateBadges();
    
    this.pieChartData = { ...this.pieChartData };
    this.barChartData = { ...this.barChartData };
  }

  private generateBadges(): void {
    const newBadges: Badge[] = [];
    
    if (this.reforestacionCount >= 1) {
      newBadges.push({
        id: 'ref-1', type: 'reforestacion', title: 'Sembrador Principiante',
        description: 'Participaste en tu primera jornada de reforestación',
        earnedDate: new Date().toISOString(), iconName: 'tree-pine'
      });
    }
    if (this.reforestacionCount >= 5) {
      newBadges.push({
        id: 'ref-5', type: 'reforestacion', title: 'Guardián del Bosque',
        description: 'Has participado en más de 5 actividades de reforestación',
        earnedDate: new Date().toISOString(), iconName: 'tree-pine'
      });
    }

    if (this.reciclajeCount >= 1) {
      newBadges.push({
        id: 'rec-1', type: 'reciclaje', title: 'Reciclador Novato',
        description: 'Comenzaste tu camino en el reciclaje',
        earnedDate: new Date().toISOString(), iconName: 'trash-2'
      });
    }
    if (this.reciclajeCount >= 5) {
      newBadges.push({
        id: 'rec-5', type: 'reciclaje', title: 'Reciclador Experto',
        description: 'Has reciclado en 5 o más jornadas',
        earnedDate: new Date().toISOString(), iconName: 'trash-2'
      });
    }

    if (this.participations.length >= 10) {
      newBadges.push({
        id: 'gen-10', type: 'general', title: 'Eco Guerrero',
        description: 'Completaste 10 actividades ambientales',
        earnedDate: new Date().toISOString(), iconName: 'award'
      });
    }

    this.badges = newBadges;
  }
}
