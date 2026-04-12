import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { GreenPoint, CollectionRoute, EnvironmentalImpact } from '../models/recycling.model';

@Injectable({
  providedIn: 'root'
})
export class RecyclingService {
  private apiUrl = `${environment.apiUrl}/api/puntos-verdes`;

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

  getNearbyPoints(): Observable<GreenPoint[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(puntos => puntos.map(p => ({
        name: p.nombre,
        distance: p.zona || 'Cerca de ti',
        status: p.estado === 'Abierto' ? 'Abierto' : 'Cerrado',
        schedule: p.horarios && p.horarios.length > 0 
          ? `${p.horarios[0].diaSemana} ${p.horarios[0].horaApertura}-${p.horarios[0].horaCierre}`
          : 'Horario no disponible'
      } as GreenPoint)))
    );
  }

  getNextCollection(): Observable<CollectionRoute> {
    return of(this.nextCollection);
  }

  getEnvironmentalImpact(): Observable<EnvironmentalImpact> {
    return of(this.impact);
  }
}
