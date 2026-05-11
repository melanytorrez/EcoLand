import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { RecyclingService } from '../../../../core/services/recycling.service';
import { GreenPoint } from '../../../../core/models/recycling.model';

export const MATERIAL_ICONS: Record<string, string> = {
  'Vidrio': '🥃',
  'Plástico': '🧴',
  'Papel': '📄',
  'Metal': '🔩',
  'Electrónicos': '💻',
  'Orgánicos': '🌿',
};

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  standalone: false
})
export class CatalogoComponent implements OnInit {
  allPoints: GreenPoint[] = [];
  filteredPoints: GreenPoint[] = [];
  searchTerm = '';
  selectedMaterial: string | null = null;
  isLoading = true;
  error: string | null = null;

  readonly materials = ['Vidrio', 'Plástico', 'Papel', 'Metal', 'Electrónicos', 'Orgánicos'];
  readonly materialIcons = MATERIAL_ICONS;

  constructor(
    private recyclingService: RecyclingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPoints();
  }

  loadPoints(): void {
    this.isLoading = true;
    this.error = null;
    this.recyclingService.getPuntosVerdes().subscribe({
      next: (points) => {
        this.allPoints = points;
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar los puntos verdes. Intenta de nuevo.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  setSelectedMaterial(material: string | null): void {
    this.selectedMaterial = material;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.allPoints];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        p.direccion.toLowerCase().includes(term) ||
        (p.zona || '').toLowerCase().includes(term)
      );
    }

    if (this.selectedMaterial) {
      result = result.filter(p =>
        (p.tiposMaterial || []).includes(this.selectedMaterial!)
      );
    }

    this.filteredPoints = result;
  }

  getMaterialIcon(material: string): string {
    return this.materialIcons[material] || '♻️';
  }

  getPointStatus(point: GreenPoint): string {
    return point.activo ? 'Abierto' : 'Cerrado';
  }

  getHorarioDisplay(point: GreenPoint): string {
    if (!point.horarios?.length) return 'Horario no disponible';
    const first = point.horarios[0];
    return `${first.diaSemana} ${first.horaApertura} - ${first.horaCierre}`;
  }

  verDetalle(id: number): void {
    this.router.navigate(['/reciclaje/puntos', id]);
  }
}
