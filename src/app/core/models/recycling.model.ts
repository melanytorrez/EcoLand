export interface GreenPoint {
  name: string;
  distance: string;
  status: 'Abierto' | 'Cerrado';
  schedule: string;
}

export interface CollectionRoute {
  day: string;
  date: string;
  time: string;
  zone: string;
  vehicle: string;
}

export interface EnvironmentalImpact {
  recycled: string;
  trees: string;
  co2: string;
  rank: string;
}
