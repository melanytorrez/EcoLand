import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StatisticsService, ComprehensiveStatistics } from '../../core/services/statistics.service';
import { ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { Chart } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { catchError, finalize, forkJoin, of, timeout } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
  standalone: false
})
export class StatisticsComponent implements OnInit {
  isLoading = true;
  data: ComprehensiveStatistics | null = null;

  // Summary Cards
  summaryCards = [
    { icon: 'tree-deciduous', label: 'Árboles Plantados', value: '0', subtitle: 'equivalente a 185 hectáreas de bosque' },
    { icon: 'leaf', label: 'CO2 Mitigado', value: '0', subtitle: 'kg/año reducidos' },
    { icon: 'recycle', label: 'Campañas Completadas', value: '0', subtitle: '' },
    { icon: 'droplets', label: 'Agua Ahorrada', value: '0', subtitle: 'litros' },
  ];

  impactCards = [
    { icon: 'tree-deciduous', label: 'Árboles plantados', value: '15,432', detail: 'Equivalente a 185 hectáreas de bosque' },
    { icon: 'recycle', label: 'Residuos reciclados', value: '328 ton', detail: 'Reducción de 520 toneladas de CO₂' },
    { icon: 'droplets', label: 'Agua ahorrada', value: '2.4M L', detail: 'Gracias al reciclaje de papel y plástico' },
  ];

  // Bar chart: Monthly planted trees
  public monthlyChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#111827',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 16,
        displayColors: false
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f3f4f6' } }
    }
  };
  public monthlyChartType: ChartType = 'bar';
  public monthlyChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: '#22c55e',
        borderColor: '#16a34a',
        borderWidth: 1,
        borderRadius: 12,
        label: 'Árboles Plantados'
      }
    ]
  };

  // Pie chart: Residue distribution
  public residueChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { padding: 20, font: { size: 12 } }
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#111827',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 16,
        displayColors: true,
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed} kg`
        }
      }
    }
  };
  public residueChartType: ChartType = 'doughnut';
  public residueChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#22c55e', '#84cc16', '#06b6d4', '#8b5cf6', '#ec4899'],
        borderColor: '#ffffff',
        borderWidth: 2
      }
    ]
  };

  // Bar chart: Zone activity
  public zoneChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#111827',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 16,
        displayColors: false
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f3f4f6' } }
    }
  };
  public zoneChartType: ChartType = 'bar';
  public zoneChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: '#8b5cf6',
        borderColor: '#7c3aed',
        borderWidth: 1,
        borderRadius: 12,
        label: 'Actividades por Zona'
      }
    ]
  };

  // Line chart: Volunteer growth
  public volunteerChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#111827',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 16,
        displayColors: false
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f3f4f6' } }
    }
  };
  public volunteerChartType: ChartType = 'line';
  public volunteerChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 2,
        fill: true,
        pointBackgroundColor: '#f97316',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        tension: 0.4,
        label: 'Crecimiento de Voluntarios'
      }
    ]
  };

  // Bar chart: Campaign vs Participants
  public campaignChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#111827',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 16,
        displayColors: false
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f3f4f6' } }
    }
  };
  public campaignChartType: ChartType = 'bar';
  public campaignChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: '#4CAF50',
        borderColor: '#2E7D32',
        borderWidth: 1,
        borderRadius: 12,
        label: 'Participantes por Campaña'
      }
    ]
  };

  constructor(
    private statsService: StatisticsService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Escuchar cambios de idioma
    this.translate.onLangChange.subscribe(() => {
      this.updateTranslations();
      this.cdr.detectChanges();
    });

    // Asegurar que las traducciones iniciales se procesen
    this.translate.get('stats.hero.title').subscribe(() => {
      this.updateTranslations();
      this.cdr.detectChanges();
    });

    const comprehensive$ = this.statsService.getComprehensiveStatistics().pipe(
      timeout(5000),
      catchError(() => of(this.getDefaultComprehensiveData()))
    );

    const campaigns$ = this.statsService.getCampaignParticipants().pipe(
      timeout(5000),
      catchError(() => of([]))
    );

    forkJoin({
      comprehensive: comprehensive$,
      campaigns: campaigns$
    }).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe(({ comprehensive, campaigns }) => {
      this.data = comprehensive;
      this.populateSummaryCards(comprehensive);
      this.populateCharts(comprehensive, campaigns);
      this.cdr.detectChanges();
    });
  }

  private populateSummaryCards(data: ComprehensiveStatistics): void {
    this.updateTranslations();
  }

  private updateTranslations(): void {
    if (!this.data) return;

    // Summary Cards
    this.summaryCards[0].label = this.translate.instant('stats.summary.trees.label');
    this.summaryCards[0].value = this.data.plantedTrees.toLocaleString();
    this.summaryCards[0].subtitle = this.translate.instant('stats.summary.trees.equivalent_dynamic', { val: (this.data.plantedTrees / 1000).toFixed(0) });
    
    this.summaryCards[1].label = this.translate.instant('stats.summary.co2.label');
    this.summaryCards[1].value = this.data.mitigatedCo2Kg.toLocaleString(undefined, { maximumFractionDigits: 0 });
    this.summaryCards[1].subtitle = this.translate.instant('stats.summary.co2.subtitle');
    
    this.summaryCards[2].label = this.translate.instant('stats.summary.campaigns.label');
    this.summaryCards[2].value = this.data.completedCampaigns.toLocaleString();
    this.summaryCards[2].subtitle = '';
    
    this.summaryCards[3].label = this.translate.instant('stats.summary.water.label');
    this.summaryCards[3].value = (this.data.waterSavedLiters / 1000000).toFixed(1) + 'M';
    this.summaryCards[3].subtitle = this.translate.instant('stats.summary.water.subtitle');

    // Impact Cards
    this.impactCards[0].label = this.translate.instant('stats.summary.trees.label');
    this.impactCards[0].value = this.data.plantedTrees.toLocaleString();
    this.impactCards[0].detail = this.translate.instant('stats.summary.trees.equivalent_dynamic', { val: (this.data.forestAreaHectares).toFixed(0) });
    
    this.impactCards[1].label = this.translate.instant('stats.summary.recycling.label');
    this.impactCards[1].value = '328 ton'; // If you ever make this dynamic, it goes here
    this.impactCards[1].detail = this.translate.instant('stats.summary.recycling.equivalent_dynamic', { val: (this.data.mitigatedCo2Kg / 1000).toFixed(0) });
    
    this.impactCards[2].label = this.translate.instant('stats.summary.water.label');
    this.impactCards[2].value = (this.data.waterSavedLiters / 1000000).toFixed(1) + 'M L';
    this.impactCards[2].detail = this.translate.instant('stats.summary.water.equivalent');

    // Forzar actualización por referencia
    this.summaryCards = [...this.summaryCards];
    this.impactCards = [...this.impactCards];
  }

  private populateCharts(data: ComprehensiveStatistics, campaigns: any[]): void {
    // Recrear objetos de datos para forzar la actualización de los gráficos (ng2-charts)
    
    // Monthly planted trees
    this.monthlyChartData = {
      labels: data.monthlyPlantedTrees.map(m => m.month),
      datasets: [
        {
          ...this.monthlyChartData.datasets[0],
          data: data.monthlyPlantedTrees.map(m => m.value)
        }
      ]
    };

    // Residue distribution
    this.residueChartData = {
      labels: data.residueDistribution.map(r => r.type),
      datasets: [
        {
          ...this.residueChartData.datasets[0],
          data: data.residueDistribution.map(r => r.amount)
        }
      ]
    };

    // Zone activity
    this.zoneChartData = {
      labels: data.zoneActivity.map(z => z.zone),
      datasets: [
        {
          ...this.zoneChartData.datasets[0],
          data: data.zoneActivity.map(z => z.activities)
        }
      ]
    };

    // Volunteer growth
    this.volunteerChartData = {
      labels: data.volunteerGrowth.map(v => v.month),
      datasets: [
        {
          ...this.volunteerChartData.datasets[0],
          data: data.volunteerGrowth.map(v => v.totalVolunteers)
        }
      ]
    };

    // Campaign vs Participants
    this.campaignChartData = {
      labels: campaigns.map(c => c.title),
      datasets: [
        {
          ...this.campaignChartData.datasets[0],
          data: campaigns.map(c => c.participants)
        }
      ]
    };
  }

  private getDefaultComprehensiveData(): ComprehensiveStatistics {
    return {
      totalCampaigns: 0,
      activeCampaigns: 0,
      totalParticipants: 0,
      completedCampaigns: 0,
      plantedTrees: 0,
      mitigatedCo2Kg: 0,
      monthlyPlantedTrees: [],
      residueDistribution: [],
      zoneActivity: [],
      volunteerGrowth: [],
      waterSavedLiters: 0,
      forestAreaHectares: 0
    };
  }
}
