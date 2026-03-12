import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: false
})
export class HomeComponent {
  stats = [
    { icon: 'tree-deciduous', label: 'Árboles Plantados', value: '15,432' },
    { icon: 'recycle', label: 'Kg Reciclados', value: '328,567' },
    { icon: 'users', label: 'Voluntarios Activos', value: '1,856' },
    { icon: 'trending-up', label: 'Campañas Activas', value: '24' },
  ];

  campaigns = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzJTIwZm9yZXN0fGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Reforestación Parque Tunari',
      date: '24 de Febrero, 2026',
      location: 'Parque Nacional Tunari',
      spots: '45 cupos disponibles',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1729434170023-cad95b4e419f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHJlZm9yZXN0YXRpb24lMjBwYXJrJTIwbmF0dXJlfGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Bosques Urbanos Centro',
      date: '28 de Febrero, 2026',
      location: 'Plaza Colón',
      spots: '30 cupos disponibles',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzJTIwZm9yZXN0fGVufDF8fHx8MTc3MTIxMzM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Recuperación Zona Sur',
      date: '5 de Marzo, 2026',
      location: 'Av. Blanco Galindo',
      spots: '60 cupos disponibles',
    },
  ];

  getSpotCount(spots: string): string {
    return spots.split(' ')[0];
  }
}
