import { Component, OnInit } from '@angular/core';
import { RecyclingService } from '../../../core/services/recycling.service';
import { GreenPoint } from '../../../core/models/recycling.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-puntos-verdes',
  templateUrl: './admin-puntos-verdes.component.html',
  styleUrls: ['./admin-puntos-verdes.component.css'],
  standalone: false
})
export class AdminPuntosVerdesComponent implements OnInit {
  points: GreenPoint[] = [];
  filteredPoints: GreenPoint[] = [];
  searchTerm: string = '';
  showModal: boolean = false;
  isLoading: boolean = false;
  
  selectedPoint: Partial<GreenPoint> = {};
  isEditing: boolean = false;

  constructor(private recyclingService: RecyclingService) {}

  ngOnInit(): void {
    this.loadPoints();
  }

  loadPoints(): void {
    this.isLoading = true;
    this.recyclingService.getPuntosVerdes()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data: GreenPoint[]) => {
          this.points = data;
          this.applyFilter();
        },
        error: (err: any) => console.error('Error loading points', err)
      });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredPoints = [...this.points];
    } else {
      this.filteredPoints = this.points.filter(p => 
        p.nombre.toLowerCase().includes(term) || 
        p.zona.toLowerCase().includes(term) ||
        p.direccion.toLowerCase().includes(term)
      );
    }
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  openModal(point?: GreenPoint): void {
    if (point) {
      this.selectedPoint = { ...point };
      this.isEditing = true;
    } else {
      this.selectedPoint = {
        nombre: '',
        direccion: '',
        zona: '',
        estado: 'ACTIVO',
        tiposMaterial: [],
        horarios: []
      };
      this.isEditing = false;
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPoint = {};
  }

  handleDelete(id: number): void {
    if (confirm('¿Está seguro de eliminar este punto verde?')) {
      this.recyclingService.deletePuntoVerde(id).subscribe({
        next: () => {
          this.points = this.points.filter(p => p.id !== id);
          this.applyFilter();
        },
        error: (err: any) => alert('Error al eliminar el punto verde')
      });
    }
  }

  savePoint(): void {
    if (this.isEditing && this.selectedPoint.id) {
      this.recyclingService.updatePuntoVerde(this.selectedPoint.id, this.selectedPoint).subscribe({
        next: (updated: GreenPoint) => {
          const index = this.points.findIndex(p => p.id === updated.id);
          if (index !== -1) {
            this.points[index] = updated;
            this.applyFilter();
          }
          this.closeModal();
        },
        error: (err: any) => alert('Error al actualizar el punto verde')
      });
    } else {
      this.recyclingService.createPuntoVerde(this.selectedPoint).subscribe({
        next: (created: GreenPoint) => {
          this.points.push(created);
          this.applyFilter();
          this.closeModal();
        },
        error: (err: any) => alert('Error al crear el punto verde')
      });
    }
  }
}
