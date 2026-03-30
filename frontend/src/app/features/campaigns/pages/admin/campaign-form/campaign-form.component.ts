import { Component } from '@angular/core';

export interface Campaign {
  id: number;
  title: string;
  date: string;
  location: string;
  spots: number;
  participants: number;
  status: 'Activa' | 'Programada' | 'Finalizada';
  organizer: string;
}

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
export class CampaignFormComponent {
  searchTerm: string = '';
  showModal: boolean = false;
  
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

  campaigns: Campaign[] = [
    {
      id: 1,
      title: 'Reforestación Parque Tunari',
      date: '24/02/2026',
      location: 'Parque Nacional Tunari',
      spots: 45,
      participants: 32,
      status: 'Activa',
      organizer: 'Alcaldía de Cochabamba',
    },
    {
      id: 2,
      title: 'Bosques Urbanos Centro',
      date: '28/02/2026',
      location: 'Plaza Colón',
      spots: 30,
      participants: 18,
      status: 'Activa',
      organizer: 'EcoLand',
    },
    {
      id: 3,
      title: 'Recuperación Zona Sur',
      date: '05/03/2026',
      location: 'Av. Blanco Galindo',
      spots: 60,
      participants: 42,
      status: 'Programada',
      organizer: 'ONG Verde Bolivia',
    },
  ];

  get filteredCampaigns(): Campaign[] {
    return this.campaigns.filter(
      (campaign) =>
        campaign.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        campaign.location.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  handleDelete(id: number): void {
    if (confirm('¿Está seguro de eliminar esta campaña?')) {
      this.campaigns = this.campaigns.filter((c) => c.id !== id);
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

    // Crear nueva campaña
    const newCampaign: Campaign = {
      id: Math.max(...this.campaigns.map(c => c.id), 0) + 1,
      title: this.formData.title,
      date: this.formatDateForDisplay(this.formData.date),
      location: this.formData.location,
      spots: parseInt(this.formData.spots),
      participants: 0,
      status: this.formData.status,
      organizer: this.formData.organizer,
    };

    this.campaigns = [...this.campaigns, newCampaign];
    
    // Resetear formulario
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
    this.showModal = false;

    // Mostrar notificación de éxito
    alert('¡Campaña creada exitosamente!');
  }

  formatDateForDisplay(dateString: string): string {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return dateString;
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
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
