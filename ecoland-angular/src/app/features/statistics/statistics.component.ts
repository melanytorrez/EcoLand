import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../core/services/statistics.service';
import { SummaryStat } from '../../core/models/statistics.model';
import { ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { Chart } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
  standalone: false
})
export class StatisticsComponent implements OnInit {
  summaryStats: SummaryStat[] = [];

  // Bar Chart: Trees Planted
  public barChartOptions: ChartConfiguration['options'] = {
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
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { 
        data: [], 
        backgroundColor: '#4CAF50', 
        borderColor: '#2E7D32',
        borderWidth: 1,
        borderRadius: 12,
        label: 'Árboles Plantados' 
      }
    ]
  };

  // Pie Chart: Recycling Distribution
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20, usePointStyle: true }
      }
    }
  };
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }]
  };

  // Stacked Bar Chart: Zone Activity
  public zoneChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, grid: { color: '#f3f4f6' } }
    },
    plugins: {
      legend: { position: 'bottom' }
    }
  };
  public zoneChartType: ChartType = 'bar';
  public zoneChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Kg Reciclados', backgroundColor: '#4CAF50', borderRadius: 0 },
      { data: [], label: 'Árboles Plantados', backgroundColor: '#2E7D32', borderRadius: 0 }
    ]
  };

  // Line Chart: Volunteer Growth
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f3f4f6' } }
    }
  };
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Voluntarios Activos',
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#2E7D32',
        pointBorderColor: '#fff',
        pointHoverRadius: 8,
        pointRadius: 6
      }
    ]
  };

  constructor(private statsService: StatisticsService) {}

  ngOnInit(): void {
    this.statsService.getSummaryStats().subscribe(stats => this.summaryStats = stats);

    this.statsService.getMonthlyTrees().subscribe(data => {
      this.barChartData.labels = data.map(d => d.month);
      this.barChartData.datasets[0].data = data.map(d => d.value);
    });

    this.statsService.getRecyclingDistribution().subscribe(data => {
      this.pieChartData.labels = data.map(d => d.name);
      this.pieChartData.datasets[0].data = data.map(d => d.value);
      this.pieChartData.datasets[0].backgroundColor = data.map(d => d.color);
    });

    this.statsService.getZoneActivity().subscribe(data => {
      this.zoneChartData.labels = data.map(d => d.zone);
      this.zoneChartData.datasets[0].data = data.map(d => d.recycling);
      this.zoneChartData.datasets[1].data = data.map(d => d.reforestation);
    });

    this.statsService.getVolunteerGrowth().subscribe(data => {
      this.lineChartData.labels = data.map(d => d.month);
      this.lineChartData.datasets[0].data = data.map(d => d.value);
    });
  }
}
