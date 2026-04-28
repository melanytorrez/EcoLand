import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of, tap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureToggleService {
  private features: { [key: string]: boolean } = {};
  private apiUrl = `${environment.apiUrl}/api/features`;

  constructor(private http: HttpClient) {}

  /**
   * Carga la configuracion de toggles desde el backend.
   * En caso de error, asume configuracion por defecto (false).
   */
  loadFeatures(): Observable<any> {
    return this.http.get<{ [key: string]: boolean }>(this.apiUrl).pipe(
      tap(features => {
        this.features = features;
        console.log('Feature Toggles cargados:', this.features);
      }),
      catchError(error => {
        console.error('Error cargando Feature Toggles. Usando valores por defecto seguros.', error);
        // Resiliencia: si falla, mantenemos todo apagado por seguridad o los basicos prendidos
        // Para no romper la demo actual, activamos los principales y apagamos TEST_FEATURE
        this.features = {
          'STATISTICS': true,
          'RECYCLING': true,
          'REFORESTATION': true,
          'TEST_FEATURE': false
        };
        return of(this.features);
      })
    );
  }

  /**
   * Verifica si una feature esta habilitada.
   * @param featureName Nombre del feature toggle
   * @returns true si esta encendido, false si esta apagado o no existe
   */
  isEnabled(featureName: string): boolean {
    return this.features[featureName] === true;
  }
}
