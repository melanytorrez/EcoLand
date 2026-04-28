import { Component, OnInit } from '@angular/core';
import { FeatureFlagService } from '../../core/services/feature-flag.service';

export interface FeatureConfig {
  key: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  enabled: boolean;
}

@Component({
  selector: 'app-feature-toggles-admin',
  templateUrl: './feature-toggles-admin.html',
  styleUrls: ['./feature-toggles-admin.css'],
  standalone: false
})
export class FeatureTogglesAdmin implements OnInit {
  
  featureConfigMap: { [key: string]: Omit<FeatureConfig, 'enabled' | 'key'> } = {
    'inicio': {
      title: 'Inicio',
      description: 'Página principal y dashboard de acceso rápido a la plataforma',
      icon: 'layout-dashboard',
      color: 'from-[#2E7D32] to-[#4CAF50]',
    },
    'reforestacion': {
      title: 'Módulo de Reforestación',
      description: 'Permite a los usuarios ver y participar en campañas de reforestación',
      icon: 'tree-pine',
      color: 'from-[#2E7D32] to-[#4CAF50]',
    },
    'reciclaje': {
      title: 'Módulo de Reciclaje',
      description: 'Muestra información sobre puntos de reciclaje y rutas de recolección',
      icon: 'trash-2',
      color: 'from-[#4CAF50] to-[#A5D6A7]',
    },
    'estadisticas': {
      title: 'Módulo de Estadísticas',
      description: 'Muestra estadísticas ambientales y métricas de impacto',
      icon: 'bar-chart-3',
      color: 'from-purple-600 to-purple-700',
    },
    'perfil': {
      title: 'Perfil del Usuario',
      description: 'Gestión de cuenta personal, configuración y resumen de actividad',
      icon: 'user',
      color: 'from-blue-600 to-blue-700',
    }
  };

  features: FeatureConfig[] = [];

  constructor(
    private featureFlagService: FeatureFlagService
  ) {}

  ngOnInit(): void {
    this.loadFeatures();
  }

  loadFeatures(): void {
    const flags = this.featureFlagService.getFlags();
    
    // Convert object to array using config mapping
    this.features = Object.keys(this.featureConfigMap).map(key => {
      return {
        key,
        enabled: flags[key] !== undefined ? flags[key] : true, // default true
        ...this.featureConfigMap[key]
      };
    });
  }

  get activeFeaturesCount(): number {
    return this.features.filter(f => f.enabled).length;
  }

  get inactiveFeaturesCount(): number {
    return this.features.filter(f => !f.enabled).length;
  }

  toggleFeature(feature: FeatureConfig): void {
    const isChecked = !feature.enabled;
    
    // Optimistic UI update
    feature.enabled = isChecked;

    this.featureFlagService.updateFeature(feature.key, isChecked).subscribe({
      next: () => {
        // Success silently
      },
      error: (err: any) => {
        // Revert on error
        feature.enabled = !isChecked;
        alert('Ocurrió un error al actualizar el módulo.');
        console.error(err);
      }
    });
  }
}
