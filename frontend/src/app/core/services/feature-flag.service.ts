import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of, tap, catchError, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private features: { [key: string]: boolean } = {};
  private featuresSubject = new BehaviorSubject<{ [key: string]: boolean }>({});
  public features$ = this.featuresSubject.asObservable();
  private apiUrl = `${environment.apiUrl}/api/features`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

  loadFeatures(): Observable<any> {
    return this.http.get<{ [key: string]: boolean }>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      tap(features => {
        this.features = features;
        this.featuresSubject.next(this.features);
        console.log('Feature Toggles cargados:', this.features);
      }),
      catchError(error => {
        console.error('Error cargando Feature Toggles. Usando defaults seguros.', error);
        // Fallback resiliente
        this.features = {
          'inicio': true,
          'reforestacion': true,
          'reciclaje': true,
          'estadisticas': true,
          'perfil': true
        };
        this.featuresSubject.next(this.features);
        return of(this.features);
      })
    );
  }

  isFeatureEnabled(featureName: string): boolean {
    return this.features[featureName] !== false; // Por defecto true si no esta definido, o false dependiendo de la regla. Usaremos false estricto:
    // return this.features[featureName] === true; 
    // Wait, let's just do: if it's explicitly false in the DB, hide it. Otherwise allow it.
    if (this.features.hasOwnProperty(featureName)) {
      return this.features[featureName];
    }
    return true; // Falla seguro (dejar pasar) si no existe
  }

  getFlags(): { [key: string]: boolean } {
    return { ...this.features };
  }

  updateFeature(featureName: string, enabled: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${featureName}?enabled=${enabled}`, {}, { headers: this.getHeaders() }).pipe(
      tap(() => {
        this.features[featureName] = enabled;
        this.featuresSubject.next(this.features);
      })
    );
  }
}
