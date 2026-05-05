export interface User {
  id: number;
  nombre: string;
  fullName?: string;
  email: string;
  role: 'USUARIO' | 'LIDER' | 'ADMINISTRADOR';
  promotionStatus?: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
}
