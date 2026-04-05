import { Injectable } from '@angular/core';
import { RecyclingCampaign } from '../models/recycling-campaign.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecyclingCampaignService {
  private campaigns: RecyclingCampaign[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1703223513358-12fde6b96580?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwcmVjeWNsaW5nJTIwY2FtcGFpZ24lMjBzb3J0aW5nfGVufDF8fHx8MTc3MTk1Nzk1MXww&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Junio sin Plástico',
      wasteType: 'Plástico',
      date: '1-30 de Junio, 2026',
      location: 'Toda la ciudad de Cochabamba',
      goal: '5,000 kg',
      collected: 3240,
      goalAmount: 5000,
      status: 'Activa',
      participants: 456,
      typeColor: 'blue',
      organizer: 'Alcaldía de Cochabamba',
      organizerContact: 'reciclaje@cochabamba.gob.bo',
      description: `La campaña "Junio sin Plástico" es una iniciativa ambiciosa que busca reducir significativamente el consumo de plástico de un solo uso en toda la ciudad de Cochabamba durante todo el mes de junio.

Esta campaña tiene como objetivo principal:

• Recolectar 5,000 kg de residuos plásticos para su correcto reciclaje
• Concientizar a la población sobre el impacto ambiental del plástico
• Promover alternativas sostenibles y reutilizables
• Fortalecer la red de puntos verdes en la ciudad

¿Cómo participar?

1. Registra tu participación en la plataforma
2. Separa tus residuos plásticos en casa
3. Lleva tus plásticos a cualquier punto verde de la ciudad
4. Registra el peso de tu contribución
5. Gana puntos y premios por tu aporte

Tipos de plástico que aceptamos:
• Botellas PET (agua, gaseosas)
• Envases de productos de limpieza
• Bolsas plásticas limpias y secas
• Envases de alimentos (limpios)
• Tapas y tapones plásticos`,
      benefits: [
        'Certificado digital de participación',
        'Puntos canjeables por productos eco-friendly',
        'Reconocimiento en redes sociales',
        'Contribución al ranking de recicladores',
      ],
      rewards: [
        { rank: 'Oro', requirement: '100+ kg', participants: 12 },
        { rank: 'Plata', requirement: '50-99 kg', participants: 34 },
        { rank: 'Bronce', requirement: '20-49 kg', participants: 78 },
      ],
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1654078054613-a56cfcabdb84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBlciUyMGNhcmRib2FyZCUyMHJlY3ljbGluZyUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzcxOTU3OTUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Papel y Cartón Universitario',
      wasteType: 'Papel y Cartón',
      date: '15 Feb - 15 Mar, 2026',
      location: 'Universidades Cbba',
      goal: '3,000 kg',
      collected: 2100,
      goalAmount: 3000,
      status: 'Activa',
      participants: 289,
      typeColor: 'yellow',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1654718421032-8aee5603b51f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFzcyUyMGJvdHRsZSUyMHJlY3ljbGluZyUyMGdyZWVufGVufDF8fHx8MTc3MTk1Nzk1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Vidrio para el Futuro',
      wasteType: 'Vidrio',
      date: '10-25 de Marzo, 2026',
      location: 'Zona Sur',
      goal: '2,500 kg',
      collected: 1850,
      goalAmount: 2500,
      status: 'Activa',
      participants: 178,
      typeColor: 'green',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1703223513358-12fde6b96580?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwcmVjeWNsaW5nJTIwY2FtcGFpZ24lMjBzb3J0aW5nfGVufDF8fHx8MTc3MTk1Nzk1MXww&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Desafío Metal Limpio',
      wasteType: 'Metal',
      date: '5-20 de Abril, 2026',
      location: 'Zona Norte',
      goal: '1,800 kg',
      collected: 980,
      goalAmount: 1800,
      status: 'Programada',
      participants: 124,
      typeColor: 'gray',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1654078054613-a56cfcabdb84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBlciUyMGNhcmRib2FyZCUyMHJlY3ljbGluZyUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzcxOTU3OTUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Campaña Escolar Verde',
      wasteType: 'Papel',
      date: '1-30 de Mayo, 2026',
      location: 'Colegios de Cbba',
      goal: '4,200 kg',
      collected: 3650,
      goalAmount: 4200,
      status: 'Activa',
      participants: 892,
      typeColor: 'yellow',
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1654718421032-8aee5603b51f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFzcyUyMGJvdHRsZSUyMHJlY3ljbGluZyUyMGdyZWVufGVufDF8fHx8MTc3MTk1Nzk1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Reciclón Familiar',
      wasteType: 'Mixto',
      date: '15-16 de Junio, 2026',
      location: 'Plaza 14 de Septiembre',
      goal: '6,000 kg',
      collected: 4120,
      goalAmount: 6000,
      status: 'Activa',
      participants: 634,
      typeColor: 'purple',
    },
  ];

  constructor() {}

  getCampaigns(): Observable<RecyclingCampaign[]> {
    return of(this.campaigns);
  }

  getCampaignById(id: number): Observable<RecyclingCampaign | undefined> {
    const campaign = this.campaigns.find(c => c.id === id);
    return of(campaign);
  }
}
