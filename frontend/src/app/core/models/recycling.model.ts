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

export interface RutaReciclaje {
  id: number;
  zona: string;
  diaSemana: string;
  horario: string;
  vehiculoAsignado: string;
  descripcion: string;
  coordenadas: string[];
}

export interface EnvironmentalImpact {
  recycled: string;
  trees: string;
  co2: string;
  rank: string;
}
