export interface GreenPoint {
  id: number;
  nombre: string;
  direccion: string;
  zona: string;
  estado: string;
  activo: boolean;
  horarios?: GreenPointSchedule[];
  tiposMaterial?: string[];
  latitud?: number;
  longitud?: number;
  imagenUrl?: string;
}

export interface GreenPointSchedule {
  id: number;
  diaSemana: string;
  horaApertura: string;
  horaCierre: string;
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
