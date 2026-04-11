import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { GreenPoint, CollectionRoute, EnvironmentalImpact } from '../models/recycling.model';

@Injectable({
  providedIn: 'root'
})
export class RecyclingService {
  private readonly apiUrl = 'http://localhost:8082/api/puntos-verdes';

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

  constructor(private http: HttpClient) {}

  getPuntosVerdes(): Observable<GreenPoint[]> {
    return this.http.get<GreenPoint[]>(this.apiUrl);
  }

  getNearbyPoints(): Observable<GreenPoint[]> {
    return this.getPuntosVerdes();
  }

  getNextCollection(): Observable<CollectionRoute> {
    return of(this.nextCollection);
  }

  getEnvironmentalImpact(): Observable<EnvironmentalImpact> {
    return of(this.impact);
  }
}
