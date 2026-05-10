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
  private readonly apiUrl = `${environment.apiUrl}/api/puntos-verdes`;

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

  private mapPoint(p: any): GreenPoint {
    return {
      id: p.id,
      nombre: p.nombre,
      direccion: p.direccion,
      zona: p.zona || 'Cerca de ti',
      estado: p.estado,
      activo: p.estado === 'ACTIVO' || p.estado === 'Abierto' || p.estado === 'abierto' || p.estado === 'activo',
      horarios: p.horarios,
      tiposMaterial: p.tiposMaterial,
      latitud: p.latitud,
      longitud: p.longitud,
      imagenUrl: p.imagenUrl
    } as GreenPoint;
  }

  getPuntosVerdes(): Observable<GreenPoint[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(puntos => puntos.map(p => this.mapPoint(p)))
    );
  }

  getPuntoVerdeById(id: number): Observable<GreenPoint> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(p => this.mapPoint(p))
    );
  }

  createPuntoVerde(data: Partial<GreenPoint>): Observable<GreenPoint> {
    return this.http.post<any>(this.apiUrl, data).pipe(
      map(p => this.mapPoint(p))
    );
  }

  updatePuntoVerde(id: number, data: Partial<GreenPoint>): Observable<GreenPoint> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data).pipe(
      map(p => this.mapPoint(p))
    );
  }

  deletePuntoVerde(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
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
