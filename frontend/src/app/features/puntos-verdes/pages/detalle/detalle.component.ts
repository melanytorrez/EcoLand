import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecyclingService } from '../../../../core/services/recycling.service';
import { GreenPoint } from '../../../../core/models/recycling.model';
import * as L from 'leaflet';
import { MATERIAL_ICONS } from '../catalogo/catalogo.component';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
  standalone: false
})
export class DetalleComponent implements OnInit, AfterViewInit, OnDestroy {
  point: GreenPoint | null = null;
  isLoading = true;
  error: string | null = null;
  readonly materialIcons = MATERIAL_ICONS;

  private map?: L.Map;
  private marker?: L.Marker;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recyclingService: RecyclingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPoint(id);
  }

  loadPoint(id: number): void {
    this.isLoading = true;
    this.error = null;
    this.recyclingService.getPuntoVerdeById(id).subscribe({
      next: (point) => {
        this.point = point;
        this.isLoading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.initMap(), 200);
      },
      error: () => {
        this.error = 'No se pudo cargar el punto verde. Verificá que el ID sea correcto.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    if (!this.point?.latitud || !this.point?.longitud) return;
    const mapEl = document.getElementById('punto-map');
    if (!mapEl || this.map) return;

    const greenIcon = L.divIcon({
      html: `<div style="
        width:36px;height:36px;
        background:linear-gradient(135deg,#2E7D32,#4CAF50);
        border:3px solid white;
        border-radius:50%;
        box-shadow:0 3px 12px rgba(46,125,50,.5);
        display:flex;align-items:center;justify-content:center;
        font-size:16px;
      ">♻️</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -22],
      className: ''
    });

    this.map = L.map('punto-map', {
      center: [this.point.latitud, this.point.longitud],
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(this.map);

    this.marker = L.marker([this.point.latitud, this.point.longitud], { icon: greenIcon })
      .addTo(this.map)
      .bindPopup(`<strong>${this.point.nombre}</strong><br>${this.point.direccion}`)
      .openPopup();

    setTimeout(() => this.map?.invalidateSize(), 300);
  }

  abrirEnMaps(): void {
    if (!this.point?.latitud || !this.point?.longitud) return;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${this.point.latitud},${this.point.longitud}`,
      '_blank'
    );
  }

  volverAlCatalogo(): void {
    this.router.navigate(['/reciclaje/puntos']);
  }

  getHorarioDisplay(point: GreenPoint): string {
    if (!point.horarios?.length) return 'No especificado';
    return point.horarios.map(h => `${h.diaSemana}: ${h.horaApertura} – ${h.horaCierre}`).join(', ');
  }
}
