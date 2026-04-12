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
  isLoading = true;
  error: string | null = null;

  constructor(private recyclingService: RecyclingService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.error = null;
    
    this.recyclingService.getNearbyPoints().subscribe({
      next: (points) => {
        this.nearbyPoints = points;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching green points:', err);
        this.error = 'No se pudieron cargar los puntos verdes.';
        this.isLoading = false;
      }
    });

    this.recyclingService.getNextCollection().subscribe(route => this.nextCollection = route);
    this.recyclingService.getEnvironmentalImpact().subscribe(impact => this.impact = impact);
  }
}
