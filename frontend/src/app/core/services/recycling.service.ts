import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GreenPoint, CollectionRoute, EnvironmentalImpact } from '../models/recycling.model';

@Injectable({
  providedIn: 'root'
})
export class RecyclingService {
  private nearbyPoints: GreenPoint[] = [
    { name: 'Punto Verde Plaza Colón', distance: '0.8 km', status: 'Abierto', schedule: 'Lun-Vie 8:00-18:00' },
    { name: 'Punto Verde Mercado La Cancha', distance: '1.2 km', status: 'Abierto', schedule: 'Lun-Sáb 7:00-20:00' },
    { name: 'Punto Verde Parque Tunari', distance: '2.5 km', status: 'Cerrado', schedule: 'Lun-Dom 6:00-22:00' },
  ];

  private nextCollection: CollectionRoute = {
    day: 'Miércoles',
    date: '19 de Febrero',
    time: '08:00 AM',
    zone: 'Zona Norte - Centro',
    vehicle: 'Camión RF-123',
  };

  private impact: EnvironmentalImpact = {
    recycled: '156 kg',
    trees: '12 árboles',
    co2: '340 kg CO₂',
    rank: 'Top 15%',
  };

  constructor() {}

  getNearbyPoints(): Observable<GreenPoint[]> {
    return of(this.nearbyPoints);
  }

  getNextCollection(): Observable<CollectionRoute> {
    return of(this.nextCollection);
  }

  getEnvironmentalImpact(): Observable<EnvironmentalImpact> {
    return of(this.impact);
  }
}
