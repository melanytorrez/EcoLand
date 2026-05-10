import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { RecyclingService } from '../../../../core/services/recycling.service';
import { GreenPoint } from '../../../../core/models/recycling.model';

export const MATERIAL_ICONS: Record<string, string> = {
  'Vidrio':       '🫙',
  'Plástico':     '♻️',
  'Papel':        '📄',
  'Cartón':       '📦',
  'Metal':        '🔩',
  'Electrónicos': '💻',
  'Orgánico':     '🌱',
  'Textil':       '👕',
  'Aceite':       '🛢️',
  'Baterías':     '🔋',
};

export const ALL_MATERIALS = Object.keys(MATERIAL_ICONS);

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
  selectedMaterials: string[] = [];
  isLoading = true;
  error: string | null = null;

  readonly allMaterials = ALL_MATERIALS;
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

  toggleMaterial(material: string): void {
    const idx = this.selectedMaterials.indexOf(material);
    if (idx >= 0) {
      this.selectedMaterials.splice(idx, 1);
    } else {
      this.selectedMaterials.push(material);
    }
    this.applyFilters();
  }

  isMaterialSelected(material: string): boolean {
    return this.selectedMaterials.includes(material);
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

    if (this.selectedMaterials.length > 0) {
      result = result.filter(p =>
        this.selectedMaterials.every(mat =>
          (p.tiposMaterial || []).includes(mat)
        )
      );
    }

    this.filteredPoints = result;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedMaterials = [];
    this.applyFilters();
  }

  getPointStatus(point: GreenPoint): 'Abierto' | 'Cerrado' {
    return point.activo ? 'Abierto' : 'Cerrado';
  }

  getHorarioHoy(point: GreenPoint): string {
    if (!point.horarios?.length) return 'Horario no disponible';
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const hoy = dias[new Date().getDay()];
    const horario = point.horarios.find(h =>
      h.diaSemana?.startsWith(hoy) || h.diaSemana?.toLowerCase().includes(hoy.toLowerCase())
    ) || point.horarios[0];
    return `${horario.diaSemana} ${horario.horaApertura} - ${horario.horaCierre}`;
  }

  verDetalle(id: number): void {
    this.router.navigate(['/reciclaje/puntos', id]);
  }
}
