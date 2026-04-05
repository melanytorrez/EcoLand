import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../../../../../core/services/campaign.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { Campaign } from '../../../../../core/models/campaign.model';

export interface CampaignFormData {
  title: string;
  date: string;
  location: string;
  spots: string;
  status: 'Activa' | 'Programada' | 'Finalizada';
  organizer: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
  standalone: false
})
export class CampaignFormComponent implements OnInit {
  searchTerm: string = '';
  showModal: boolean = false;
  editingId: number | null = null;
  
  formData: CampaignFormData = {
    title: '',
    date: '',
    location: '',
    spots: '',
    status: 'Programada',
    organizer: '',
    description: '',
    image: '',
  };
  
  formErrors: Record<string, string> = {};

  campaigns: Campaign[] = [];

  constructor(
    private campaignService: CampaignService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.campaignService.getCampaigns().subscribe({
      next: (data) => {
        this.campaigns = data;
      },
      error: (err) => {
        console.error('Error cargando campañas', err);
      }
    });
  }

  get filteredCampaigns(): Campaign[] {
    return this.campaigns.filter(
      (campaign) =>
        campaign.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        campaign.location.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  handleDelete(id: number): void {
    if (confirm('¿Está seguro de eliminar permanentemente esta campaña de la base de datos?')) {
      const token = this.authService.getToken();
      if (!token) {
        alert('Error: Debe iniciar sesión como administrador.');
        return;
      }

      this.campaignService.deleteCampaign(id, token).subscribe({
        next: () => {
          this.loadCampaigns();
          alert('Campaña eliminada correctamente.');
        },
        error: (err) => {
          console.error('Error al eliminar campaña', err);
          alert('Hubo un error al intentar eliminar la campaña de la base de datos.');
        }
      });
    }
  }

  validateForm(): boolean {
    const errors: Record<string, string> = {};

    if (!this.formData.title.trim()) {
      errors['title'] = 'El título es requerido';
    }
    if (!this.formData.date) {
      errors['date'] = 'La fecha es requerida';
    }
    if (!this.formData.location.trim()) {
      errors['location'] = 'La ubicación es requerida';
    }
    if (!this.formData.spots || parseInt(this.formData.spots) <= 0) {
      errors['spots'] = 'Los cupos deben ser mayores a 0';
    }
    if (!this.formData.organizer.trim()) {
      errors['organizer'] = 'El organizador es requerido';
    }
    if (!this.formData.description.trim()) {
      errors['description'] = 'La descripción es requerida';
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
      alert('Error: Sesión de administrador expirada o inválida. Por favor, vuelva a iniciar sesión.');
      return;
    }

    const newCampaign = {
      title: this.formData.title,
      date: this.formatDateForDisplay(this.formData.date),
      location: this.formData.location,
      spots: parseInt(this.formData.spots),
      participants: 0,
      status: this.formData.status,
      organizer: this.formData.organizer,
      description: this.formData.description,
      image: this.formData.image,
    };

    if (this.editingId) {
      this.campaignService.updateCampaign(this.editingId, newCampaign, token).subscribe({
        next: () => {
          this.loadCampaigns();
          this.closeModal();
          alert('¡Campaña actualizada exitosamente en la base de datos MySQL!');
        },
        error: (err) => {
          console.error('Error actualizando en BD:', err);
          alert('Ocurrió un error al actualizar la campaña en el servidor.');
        }
      });
    } else {
      this.campaignService.createCampaign(newCampaign, token).subscribe({
        next: () => {
          this.loadCampaigns();
          this.closeModal();
          alert('¡Campaña guardada exitosamente en la base de datos MySQL!');
        },
        error: (err) => {
          console.error('Error guardando en BD:', err);
          alert('Ocurrió un error al guardar la campaña en el servidor.');
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
        location: campaign.location,
        spots: campaign.spots ? campaign.spots.toString() : '',
        status: (campaign.status as 'Activa' | 'Programada' | 'Finalizada') || 'Programada',
        organizer: campaign.organizer,
        description: campaign.description || '',
        image: campaign.image || '',
      };
    } else {
      this.editingId = null;
      this.formData = {
        title: '',
        date: '',
        location: '',
        spots: '',
        status: 'Programada',
        organizer: '',
        description: '',
        image: '',
      };
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingId = null;
    this.formData = {
      title: '',
      date: '',
      location: '',
      spots: '',
      status: 'Programada',
      organizer: '',
      description: '',
      image: '',
    };
    this.formErrors = {};
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Activa':
        return 'bg-[#4CAF50] text-white';
      case 'Programada':
        return 'bg-blue-100 text-blue-700';
      case 'Finalizada':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getPercentage(participants: number, spots: number): number {
    return (participants / spots) * 100;
  }
}
