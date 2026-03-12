import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MonthlyStat, DistributionStat, ZoneStat, SummaryStat } from '../models/statistics.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private stats: SummaryStat[] = [
    { icon: 'TreeDeciduous', label: 'Árboles Plantados', value: '15,432', change: '+1,234 este mes', color: 'from-[#2E7D32] to-[#4CAF50]' },
    { icon: 'Recycle', label: 'Kg Reciclados', value: '328,567', change: '+12,450 este mes', color: 'from-blue-500 to-blue-700' },
    { icon: 'Users', label: 'Voluntarios Activos', value: '1,856', change: '+142 este mes', color: 'from-purple-500 to-purple-700' },
    { icon: 'TrendingUp', label: 'Campañas Activas', value: '24', change: '+3 esta semana', color: 'from-orange-500 to-orange-700' },
  ];

  private monthlyTrees: MonthlyStat[] = [
    { month: 'Ene', value: 890 },
    { month: 'Feb', value: 1240 },
    { month: 'Mar', value: 1100 },
    { month: 'Abr', value: 1560 },
    { month: 'May', value: 1420 },
    { month: 'Jun', value: 1680 },
  ];

  private recyclingData: DistributionStat[] = [
    { name: 'Plástico', value: 35, color: '#4CAF50' },
    { name: 'Papel', value: 25, color: '#2E7D32' },
    { name: 'Vidrio', value: 20, color: '#A5D6A7' },
    { name: 'Metal', value: 15, color: '#66BB6A' },
    { name: 'Orgánico', value: 5, color: '#81C784' },
  ];

  private zoneData: ZoneStat[] = [
    { zone: 'Norte', recycling: 180, reforestation: 45 },
    { zone: 'Sur', recycling: 145, reforestation: 38 },
    { zone: 'Este', recycling: 95, reforestation: 28 },
    { zone: 'Oeste', recycling: 120, reforestation: 32 },
    { zone: 'Centro', recycling: 210, reforestation: 52 },
  ];

  private participationData: MonthlyStat[] = [
    { month: 'Ene', value: 1420 },
    { month: 'Feb', value: 1580 },
    { month: 'Mar', value: 1650 },
    { month: 'Abr', value: 1720 },
    { month: 'May', value: 1790 },
    { month: 'Jun', value: 1856 },
  ];

  constructor() {}

  getSummaryStats(): Observable<SummaryStat[]> {
    return of(this.stats);
  }

  getMonthlyTrees(): Observable<MonthlyStat[]> {
    return of(this.monthlyTrees);
  }

  getRecyclingDistribution(): Observable<DistributionStat[]> {
    return of(this.recyclingData);
  }

  getZoneActivity(): Observable<ZoneStat[]> {
    return of(this.zoneData);
  }

  getVolunteerGrowth(): Observable<MonthlyStat[]> {
    return of(this.participationData);
  }
}
