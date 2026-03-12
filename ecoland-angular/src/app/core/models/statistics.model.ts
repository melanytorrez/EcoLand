export interface MonthlyStat {
  month: string;
  value: number;
}

export interface DistributionStat {
  name: string;
  value: number;
  color: string;
}

export interface ZoneStat {
  zone: string;
  recycling: number;
  reforestation: number;
}

export interface SummaryStat {
  icon: string;
  label: string;
  value: string;
  change: string;
  color: string;
}
