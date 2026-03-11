import { Injectable } from '@angular/core';
import { Campaign } from '../models/campaign.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private campaigns: Campaign[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzJTIwZm9yZXN0fGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Reforestación Parque Tunari',
      date: '24 de Febrero, 2026',
      time: '08:00 AM - 02:00 PM',
      location: 'Parque Nacional Tunari',
      address: 'Entrada principal del Parque Tunari, carretera a Sacaba',
      spots: 45,
      participants: 32,
      organizer: 'Alcaldía de Cochabamba',
      organizerContact: 'eventos@cochabamba.gob.bo',
      status: 'Activa',
      description: `Esta campaña de reforestación tiene como objetivo recuperar áreas degradadas del Parque Nacional Tunari, uno de los pulmones verdes más importantes de Cochabamba.

Durante la jornada se plantarán especies nativas como queñua, aliso y pino de monte, contribuyendo a la recuperación de la biodiversidad local y la protección de las cuencas hidrográficas.`,
      requirements: [
        'Ser mayor de 12 años (menores acompañados)',
        'Inscripción previa obligatoria',
        'Compromiso de asistencia',
        'Seguir indicaciones del equipo organizador',
      ],
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1729434170023-cad95b4e419f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHJlZm9yZXN0YXRpb24lMjBwYXJrJTIwbmF0dXJlfGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Bosques Urbanos Centro',
      date: '28 de Febrero, 2026',
      location: 'Plaza Colón',
      spots: 30,
      participants: 18,
      organizer: 'EcoLand',
      status: 'Activa',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzJTIwZm9yZXN0fGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Recuperación Zona Sur',
      date: '5 de Marzo, 2026',
      location: 'Av. Blanco Galindo',
      spots: 60,
      participants: 42,
      organizer: 'ONG Verde Bolivia',
      status: 'Activa',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1729434170023-cad95b4e419f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHJlZm9yZXN0YXRpb24lMjBwYXJrJTIwbmF0dXJlfGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Arborización Zona Norte',
      date: '10 de Marzo, 2026',
      location: 'Avenida Circunvalación',
      spots: 50,
      participants: 35,
      organizer: 'Alcaldía de Cochabamba',
      status: 'Activa',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzJTIwZm9yZXN0fGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Reforestación Laguna Alalay',
      date: '15 de Marzo, 2026',
      location: 'Laguna Alalay',
      spots: 80,
      participants: 56,
      organizer: 'EcoLand',
      status: 'Activa',
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1729434170023-cad95b4e419f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHJlZm9yZXN0YXRpb24lMjBwYXJrJTIwbmF0dXJlfGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Bosque Urbano Este',
      date: '20 de Marzo, 2026',
      location: 'Zona Este - Sacaba',
      spots: 40,
      participants: 28,
      organizer: 'Municipio de Sacaba',
      status: 'Activa',
    },
  ];

  constructor() { }

  getCampaigns(): Observable<Campaign[]> {
    return of(this.campaigns);
  }

  getCampaignById(id: number): Observable<Campaign | undefined> {
    const campaign = this.campaigns.find(c => c.id === id);
    return of(campaign);
  }
}
