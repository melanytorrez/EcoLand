import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CampaignService } from '../../../core/services/campaign.service';
import { AuthService } from '../../../core/services/auth.service';
import { Campaign } from '../../../core/models/campaign.model';
import { TranslateService } from '@ngx-translate/core';

export interface CampaignFormData {
  title: string;
  date: string;
  location: string;
  spots: string;
  status: 'Activa' | 'Programada' | 'Finalizada';
  organizer: string;
  description: string;
  image: string;
  category: 'REFORESTATION' | 'RECYCLING';
}

@Component({
  selector: 'app-lider-dashboard',
  templateUrl: './lider-dashboard.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule]
})
export class LiderDashboardComponent implements OnInit {
  searchTerm: string = '';
  showModal: boolean = false;
  editingId: number | null = null;
  activeTab: 'active' | 'past' = 'active';

  formData: CampaignFormData = {
    title: '',
    date: '',
    location: '',
    spots: '',
    status: 'Programada',
    organizer: '',
    description: '',
    image: '',
    category: 'REFORESTATION'
  };

  formErrors: Record<string, string> = {};
  campaigns: Campaign[] = [];

  constructor(
    private campaignService: CampaignService,
    public authService: AuthService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMyCampaigns();
  }

  loadMyCampaigns(): void {
    const token = this.authService.getToken();
    if (!token) return;

    this.campaignService.getMyCampaigns(token).subscribe({
      next: (data) => {
        this.campaigns = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando mis campañas', err);
      }
    });
  }

  get currentUser(): any {
    return this.authService.getUser();
  }

  get stats() {
    const total = this.campaigns.length;
    const pending = this.campaigns.filter(c => c.status === 'PENDIENTE').length;
    const active = this.campaigns.filter(c => c.status === 'Activa' || c.status === 'ACTIVA').length;
    const rejected = this.campaigns.filter(c => c.status === 'RECHAZADA').length;
    return { total, pending, active, rejected };
  }

  get filteredCampaigns(): Campaign[] {
    let list = this.campaigns;

    // Filter by tab
    if (this.activeTab === 'active') {
      // Activa, Programada, PENDIENTE, RECHAZADA are considered active/pending/ongoing
      list = list.filter(c => c.status !== 'Finalizada');
    } else {
      list = list.filter(c => c.status === 'Finalizada');
    }

    // Filter by search
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(
        c => c.title.toLowerCase().includes(term) || c.location.toLowerCase().includes(term)
      );
    }

    return list;
  }

  handleDelete(id: number): void {
    if (confirm(this.translate.instant('admin_page.alert.confirm_delete'))) {
      const token = this.authService.getToken();
      if (!token) return;

      this.campaignService.deleteCampaign(id, token).subscribe({
        next: () => {
          this.loadMyCampaigns();
          alert(this.translate.instant('admin_page.alert.campaign_deleted'));
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al eliminar campaña', err);
          alert(this.translate.instant('admin_page.alert.delete_error'));
        }
      });
    }
  }

  validateForm(): boolean {
    const errors: Record<string, string> = {};

    if (!this.formData.title.trim()) {
      errors['title'] = this.translate.instant('admin_page.campaign_form.validation.name');
    }
    if (!this.formData.date) {
      errors['date'] = this.translate.instant('admin_page.campaign_form.validation.date');
    }
    if (!this.formData.location.trim()) {
      errors['location'] = this.translate.instant('admin_page.campaign_form.validation.location');
    }
    if (!this.formData.spots || parseInt(this.formData.spots) <= 0) {
      errors['spots'] = this.translate.instant('admin_page.campaign_form.validation.spots');
    }
    if (!this.formData.organizer.trim()) {
      errors['organizer'] = this.translate.instant('admin_page.campaign_form.validation.organizer');
    }
    if (!this.formData.description.trim()) {
      errors['description'] = this.translate.instant('admin_page.campaign_form.validation.description');
    }

    this.formErrors = errors;
    return Object.keys(errors).length === 0;
  }

  handleSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      alert(this.translate.instant('admin_page.alert.session_expired'));
      return;
    }

    const campaignPayload = {
      title: this.formData.title,
      date: this.formatDateForDisplay(this.formData.date),
      location: this.formData.location,
      spots: parseInt(this.formData.spots),
      participants: 0,
      status: this.formData.status,
      organizer: this.formData.organizer,
      description: this.formData.description,
      image: this.formData.image,
      category: this.formData.category
    };

    if (this.editingId !== null) {
      this.campaignService.updateCampaign(this.editingId, campaignPayload, token).subscribe({
        next: () => {
          this.loadMyCampaigns();
          this.closeModal();
          alert('Campaña editada con éxito. Ha sido enviada a moderación.');
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error actualizando campaña:', err);
          alert(this.translate.instant('admin_page.alert.update_error'));
        }
      });
    } else {
      this.campaignService.createCampaign(campaignPayload, token).subscribe({
        next: () => {
          this.loadMyCampaigns();
          this.closeModal();
          alert('Campaña propuesta con éxito. Pendiente de aprobación por un administrador.');
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error creando campaña:', err);
          alert(this.translate.instant('admin_page.alert.create_error'));
        }
      });
    }
  }

  formatDateForDisplay(dateString: string): string {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return dateString;
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
    }
    return dateString;
  }

  openModal(campaign?: Campaign): void {
    this.formErrors = {};

    if (campaign) {
      this.editingId = campaign.id;
      this.formData = {
        title: campaign.title,
        date: this.formatDateForInput(campaign.date),
        spots: campaign.spots ? campaign.spots.toString() : '',
        location: campaign.location,
        status: (campaign.status as any) || 'Programada',
        organizer: campaign.organizer,
        description: campaign.description || '',
        image: campaign.image || '',
        category: campaign.category || 'REFORESTATION'
      };
    } else {
      this.editingId = null;
      this.formData = {
        title: '',
        date: '',
        location: '',
        spots: '',
        status: 'Programada',
        organizer: this.currentUser?.nombre || '',
        description: '',
        image: '',
        category: 'REFORESTATION'
      };
    }

    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.editingId = null;
    this.formErrors = {};
    this.cdr.detectChanges();
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'ACTIVA':
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'PENDIENTE':
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'RECHAZADA':
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border border-rose-200';
      case 'PROGRAMADA':
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'FINALIZADA':
      case 'FINISHED':
        return 'bg-slate-100 text-slate-800 border border-slate-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }

  getPercentage(participants: number, spots: number): number {
    if (!spots || spots <= 0) return 0;
    return (participants / spots) * 100;
  }
}
