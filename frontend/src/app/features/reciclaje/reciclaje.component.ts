import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { RecyclingService } from '../../core/services/recycling.service';
import { GreenPoint, CollectionRoute, EnvironmentalImpact } from '../../core/models/recycling.model';
import * as L from 'leaflet';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reciclaje',
  templateUrl: './reciclaje.component.html',
  styleUrl: './reciclaje.component.css',
  standalone: false
})
export class ReciclajeComponent implements OnInit, AfterViewInit, OnDestroy {
  nearbyPoints: GreenPoint[] = [];
  nextCollection: CollectionRoute | undefined;
  impact: EnvironmentalImpact | undefined;
  loadingPoints = false;
  pointsError = '';
  showInteractiveMap = false;
  showNextRoute = false;
  showStatistics = false;

  private map!: L.Map;
  private markers: L.Marker[] = [];
  private userMarker?: L.Marker;

  // Cochabamba center coordinates
  private readonly CBBA_LAT = -17.3935;
  private readonly CBBA_LNG = -66.1570;

  constructor(
    private recyclingService: RecyclingService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadingPoints = true;
    this.pointsError = '';

    this.recyclingService.getPuntosVerdes().subscribe({
      next: points => {
        this.nearbyPoints = points;
        this.loadingPoints = false;
        if (this.map) {
          this.addMarkersToMap();
        }
      },
      error: () => {
        this.nearbyPoints = [];
        this.pointsError = this.translate.instant('recycling.points_card.error');
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    // Fix Leaflet default icon paths (webpack issue)
    const iconDefault = L.icon({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    this.map = L.map('map', {
      center: [this.CBBA_LAT, this.CBBA_LNG],
      zoom: 14,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(this.map);

    // Force Leaflet to recalculate container size
    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);

    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          // Center map on user
          this.map.setView([userLat, userLng], 15);

          // Add user marker with custom blue icon
          const userIcon = L.divIcon({
            html: `<div style="
              width: 16px; height: 16px;
              background: #3B82F6;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(59,130,246,0.5);
            "></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
            className: ''
          });

          this.userMarker = L.marker([userLat, userLng], { icon: userIcon })
            .addTo(this.map)
            .bindPopup(`<strong>${this.translate.instant('recycling.map.markers.your_location')}</strong>`)
            .openPopup();
        },
        () => {
          // Permission denied or error — keep default Cochabamba center
          console.log('Geolocalización no disponible, usando centro de Cochabamba');
        }
      );
    }

    if (this.nearbyPoints.length > 0) {
      this.addMarkersToMap();
    }
  }

  private addMarkersToMap(): void {
    this.markers.forEach(m => m.remove());
    this.markers = [];

    const greenIcon = L.divIcon({
      html: `<div style="
        width: 30px; height: 30px;
        background: linear-gradient(135deg, #2E7D32, #4CAF50);
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 3px 10px rgba(46,125,50,0.4);
        display: flex; align-items: center; justify-content: center;
        font-size: 14px;
      ">♻️</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -18],
      className: ''
    });

    const redIcon = L.divIcon({
      html: `<div style="
        width: 30px; height: 30px;
        background: linear-gradient(135deg, #c62828, #ef5350);
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 3px 10px rgba(198,40,40,0.4);
        display: flex; align-items: center; justify-content: center;
        font-size: 14px;
      ">♻️</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -18],
      className: ''
    });

    this.nearbyPoints.forEach(point => {
      if (point.latitud && point.longitud) {
        const icon = point.activo ? greenIcon : redIcon;
        const statusLabel = point.activo ? 'Abierto' : 'Cerrado';
        const statusColor = point.activo ? '#2E7D32' : '#c62828';

        const materialsHtml = point.tiposMaterial?.length
          ? point.tiposMaterial.map(m =>
              `<span style="background:#E8F5E9;color:#2E7D32;padding:2px 8px;border-radius:12px;font-size:11px;margin:2px;">${m}</span>`
            ).join('')
          : '';

        const popupContent = `
          <div style="min-width:200px;font-family:system-ui,-apple-system,sans-serif;">
            <h3 style="margin:0 0 6px;font-size:15px;font-weight:700;color:#1a1a1a;">${point.nombre}</h3>
            <p style="margin:0 0 4px;font-size:12px;color:#666;">📍 ${point.direccion}</p>
            <p style="margin:0 0 8px;font-size:12px;">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${statusColor};margin-right:4px;"></span>
              <strong>${statusLabel}</strong> · ${point.zona}
            </p>
            ${materialsHtml ? `<div style="display:flex;flex-wrap:wrap;gap:2px;">${materialsHtml}</div>` : ''}
          </div>
        `;

        const marker = L.marker([point.latitud, point.longitud], { icon })
          .addTo(this.map)
          .bindPopup(popupContent);

        this.markers.push(marker);
      }
    });
  }

  getPointStatus(point: GreenPoint): 'Abierto' | 'Cerrado' {
    return point.activo ? 'Abierto' : 'Cerrado';
  }

  getPointHours(point: GreenPoint): string {
    if (!point.horarios?.length) {
      return this.translate.instant('recycling.points_card.hours_unavailable');
    }

    const horario = point.horarios[0];
    return `${horario.diaSemana} ${horario.horaApertura} - ${horario.horaCierre}`;
  }
}