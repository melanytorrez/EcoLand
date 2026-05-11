import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { GreenPoint, CollectionRoute, EnvironmentalImpact, RutaReciclaje } from '../models/recycling.model';

@Injectable({
  providedIn: 'root'
})
export class RecyclingService {
  private readonly apiUrl = `${environment.apiUrl}/api/puntos-verdes`;
  private readonly rutasUrl = `${environment.apiUrl}/api/v1/rutas`;

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

  getRutas(): Observable<RutaReciclaje[]> {
    return this.http.get<RutaReciclaje[]>(this.rutasUrl);
  }

  getNextCollection(): Observable<CollectionRoute | undefined> {
    return this.getRutas().pipe(
      map(rutas => {
        if (!rutas || rutas.length === 0) return undefined;
        const ruta = rutas[0];
        return {
          day: ruta.diaSemana,
          date: ruta.horario,
          time: ruta.horario,
          zone: ruta.zona,
          vehicle: ruta.vehiculoAsignado
        } as CollectionRoute;
      })
    );
  }

  getEnvironmentalImpact(): Observable<EnvironmentalImpact> {
    return of(this.impact);
  }

  /**
   * Obtiene la ruta real siguiendo las calles entre varios puntos usando el API de OSRM.
   */
  getRoutePath(coords: [number, number][]): Observable<[number, number][]> {
    if (!coords || coords.length < 2) return of(coords);

    // OSRM usa formato: lng,lat;lng,lat
    const waypoints = coords.map(c => `${c[1]},${c[0]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (response.code === 'Ok' && response.routes && response.routes.length > 0) {
          // El API devuelve [lng, lat], lo convertimos a [lat, lng] para Leaflet
          return response.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]] as [number, number]);
        }
        return coords; // Fallback a líneas rectas si falla el API
      })
    );
  }
}

