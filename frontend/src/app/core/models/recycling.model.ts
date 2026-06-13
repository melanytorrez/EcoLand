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
  creatorId?: number;
  isApproved?: boolean;
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

export type RecyclingActivityStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface RecyclingActivityRequest {
  puntoVerdeId: number;
  material: string;
  cantidad?: string;
  unidad?: string;
  comentario?: string;
}

export interface RecyclingActivity {
  id: number;
  usuarioEmail: string;
  puntoVerdeId: number;
  puntoVerdeNombre: string;
  material: string;
  cantidad?: string;
  unidad?: string;
  comentario?: string;
  status: RecyclingActivityStatus;
  adminNotes?: string;
  registeredAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}
