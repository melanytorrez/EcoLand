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

  constructor(private recyclingService: RecyclingService) {}

  ngOnInit(): void {
    this.recyclingService.getNearbyPoints().subscribe(points => this.nearbyPoints = points);
    this.recyclingService.getNextCollection().subscribe(route => this.nextCollection = route);
    this.recyclingService.getEnvironmentalImpact().subscribe(impact => this.impact = impact);
  }
}
