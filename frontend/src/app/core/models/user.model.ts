export interface User {
  id: number;
  nombre: string;
  fullName?: string;
  email: string;
  role: 'USUARIO' | 'LIDER' | 'ADMINISTRADOR';
  promotionStatus?: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  motivation?: string;
  plans?: string;
  experience?: string;
  commitment?: string;
  contact?: string;
  zone?: string;
  organization?: string;
  fechaSolicitud?: string;
}
