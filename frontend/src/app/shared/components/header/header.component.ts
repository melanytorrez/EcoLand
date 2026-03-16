import { FeatureFlagService } from '../../../core/services/feature-flag.service';
import { FeatureFlags } from '../../../core/config/feature-flags.config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: false
})
export class HeaderComponent {
  currentPath = '';
  isAuthenticated = false; // Mock for now
  isAdmin = false; // Mock for now
  user = { name: 'Usuario' };

  allNavItems = [
    { path: '/', label: 'Inicio', feature: null },
    { path: '/reforestacion', label: 'Reforestación', feature: 'reforestacion' },
    { path: '/campanas-reciclaje', label: 'Campañas de Reciclaje', feature: 'campanasReciclaje' },
    { path: '/reciclaje', label: 'Reciclaje', feature: 'reciclaje' },
    { path: '/estadisticas', label: 'Estadísticas', feature: 'estadisticas' },
  ];

  get navItems() {
    return this.allNavItems.filter(item => 
      !item.feature || this.featureFlagService.isFeatureEnabled(item.feature as keyof FeatureFlags)
    );
  }

  constructor(private router: Router, private featureFlagService: FeatureFlagService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentPath = event.urlAfterRedirects;
    });
  }

  logout() {
    this.isAuthenticated = false;
  }
}
