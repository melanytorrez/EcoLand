import { Component, OnInit } from '@angular/core';
import { RecyclingService } from '../../core/services/recycling.service';
import { GreenPoint, CollectionRoute, EnvironmentalImpact } from '../../core/models/recycling.model';

@Component({
  selector: 'app-reciclaje',
  templateUrl: './reciclaje.component.html',
  styleUrl: './reciclaje.component.css',
  standalone: false
})
export class ReciclajeComponent implements OnInit {
  nearbyPoints: GreenPoint[] = [];
  nextCollection: CollectionRoute | undefined;
  impact: EnvironmentalImpact | undefined;
  loadingPoints = false;
  pointsError = '';
  showInteractiveMap = false;
  showNextRoute = false;
  showStatistics = false;

  constructor(private recyclingService: RecyclingService) {}

  ngOnInit(): void {
    this.loadingPoints = true;
    this.pointsError = '';

    this.recyclingService.getPuntosVerdes().subscribe({
      next: points => {
        this.nearbyPoints = points;
        this.loadingPoints = false;
      },
      error: () => {
        this.nearbyPoints = [];
        this.pointsError = 'No se pudieron cargar los puntos verdes. Intenta nuevamente más tarde.';
        this.loadingPoints = false;
      }
    });

    if (this.showNextRoute) {
      this.recyclingService.getNextCollection().subscribe(route => this.nextCollection = route);
    }

    if (this.showStatistics) {
      this.recyclingService.getEnvironmentalImpact().subscribe(impact => this.impact = impact);
    }
  }

  getPointStatus(point: GreenPoint): 'Abierto' | 'Cerrado' {
    return point.activo ? 'Abierto' : 'Cerrado';
  }

  getPointHours(point: GreenPoint): string {
    if (!point.horarios?.length) {
      return 'Horario no disponible';
    }

    const horario = point.horarios[0];
    return `${horario.diaSemana} ${horario.horaApertura} - ${horario.horaCierre}`;
  }
}
