import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RecyclingService } from '../../core/services/recycling.service';
import { GreenPoint, CollectionRoute, EnvironmentalImpact, RutaReciclaje } from '../../core/models/recycling.model';
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
  rutas: RutaReciclaje[] = [];
  loadingPoints = false;
  pointsError = '';
  showInteractiveMap = true;
  showNextRoute = true;
  showStatistics = true;

  private map!: L.Map;
  private markers: L.Marker[] = [];
  private routePolylines: L.Polyline[] = [];
  private userMarker?: L.Marker;

  // Cochabamba center coordinates
  private readonly CBBA_LAT = -17.3935;
  private readonly CBBA_LNG = -66.1570;

  // Route colors for visual distinction (public for template access)
  public readonly ROUTE_COLORS = ['#1565C0', '#E65100', '#6A1B9A', '#00838F', '#AD1457'];

  constructor(
    private recyclingService: RecyclingService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
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
        this.cdr.detectChanges();
      },
      error: () => {
        this.nearbyPoints = [];
        this.pointsError = this.translate.instant('recycling.points_card.error');
        this.loadingPoints = false;
        this.cdr.detectChanges();
      }
    });

    // Load rutas from the backend API
    this.recyclingService.getRutas().subscribe({
      next: rutas => {
        this.rutas = rutas;
        if (this.map) {
          this.drawRoutesOnMap();
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.rutas = [];
      }
    });

    if (this.showNextRoute) {
      this.recyclingService.getNextCollection().subscribe(route => {
        this.nextCollection = route;
        this.cdr.detectChanges();
      });
    }

    if (this.showStatistics) {
      this.recyclingService.getEnvironmentalImpact().subscribe(impact => {
        this.impact = impact;
        this.cdr.detectChanges();
      });
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

    if (this.rutas.length > 0) {
      this.drawRoutesOnMap();
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

  private drawRoutesOnMap(): void {
    // Remove existing polylines
    this.routePolylines.forEach(p => p.remove());
    this.routePolylines = [];

    this.rutas.forEach((ruta, index) => {
      if (!ruta.coordenadas || ruta.coordenadas.length < 2) return;

      // Parse "lat,lng" strings into LatLng tuples
      const waypoints: [number, number][] = ruta.coordenadas
        .map(coord => {
          const parts = coord.split(',');
          if (parts.length === 2) {
            const lat = parseFloat(parts[0].trim());
            const lng = parseFloat(parts[1].trim());
            if (!isNaN(lat) && !isNaN(lng)) {
              return [lat, lng] as [number, number];
            }
          }
          return null;
        })
        .filter((c): c is [number, number] => c !== null);

      if (waypoints.length < 2) return;

      const color = this.ROUTE_COLORS[index % this.ROUTE_COLORS.length];

      // Fetch the real path from OSRM
      this.recyclingService.getRoutePath(waypoints).subscribe({
        next: (detailedPath) => {
          const polyline = L.polyline(detailedPath, {
            color: color,
            weight: 6,
            opacity: 0.9,
            dashArray: '10, 8'
          }).addTo(this.map);

          const popupContent = `
            <div style="min-width:220px;font-family:system-ui,-apple-system,sans-serif;">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <div style="width:12px;height:12px;background:${color};border-radius:3px;"></div>
                <h3 style="margin:0;font-size:14px;font-weight:700;color:#1a1a1a;">${ruta.zona}</h3>
              </div>
              <p style="margin:0 0 4px;font-size:12px;color:#666;">📅 ${ruta.diaSemana}</p>
              <p style="margin:0 0 4px;font-size:12px;color:#666;">🕐 ${ruta.horario}</p>
              <p style="margin:0 0 4px;font-size:12px;color:#666;">🚛 ${ruta.vehiculoAsignado}</p>
              <p style="margin:0;font-size:11px;color:#888;margin-top:6px;">${ruta.descripcion}</p>
            </div>
          `;
          polyline.bindPopup(popupContent);
          this.routePolylines.push(polyline);
        }
      });
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