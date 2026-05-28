import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CampaignService } from '../../../core/services/campaign.service';
import { AuthService } from '../../../core/services/auth.service';
import { Campaign } from '../../../core/models/campaign.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-solicitudes',
  templateUrl: './admin-solicitudes.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule]
})
export class AdminSolicitudesComponent implements OnInit {
  campaigns: Campaign[] = [];
  searchTerm: string = '';
  loading: boolean = false;

  // Modal logic
  showModal: boolean = false;
  selectedCampaign: Campaign | null = null;
  modalType: 'approve' | 'reject' = 'approve';
  comment: string = '';
  modalError: string = '';

  constructor(
    private campaignService: CampaignService,
    private authService: AuthService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPendingCampaigns();
  }

  loadPendingCampaigns(): void {
    const token = this.authService.getToken();
    if (!token) return;

    this.loading = true;
    this.campaignService.getPendingCampaigns(token).subscribe({
      next: (data) => {
        this.campaigns = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando solicitudes', err);
        this.loading = false;
      }
    });
  }

  get filteredCampaigns(): Campaign[] {
    let list = this.campaigns;
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(
        c => c.title.toLowerCase().includes(term) || c.organizer.toLowerCase().includes(term)
      );
    }
    return list;
  }

  openActionModal(campaign: Campaign, type: 'approve' | 'reject'): void {
    this.selectedCampaign = campaign;
    this.modalType = type;
    this.comment = '';
    this.modalError = '';
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCampaign = null;
    this.comment = '';
    this.modalError = '';
    this.cdr.detectChanges();
  }

  handleActionSubmit(): void {
    if (!this.selectedCampaign) return;

    const token = this.authService.getToken();
    if (!token) {
      alert(this.translate.instant('admin_page.alert.session_expired'));
      return;
    }

    if (this.modalType === 'reject' && !this.comment.trim()) {
      this.modalError = 'El comentario es obligatorio para rechazar la campaña.';
      return;
    }

    this.modalError = '';

    if (this.modalType === 'approve') {
      this.campaignService.approveCampaign(this.selectedCampaign.id, this.comment, token).subscribe({
        next: () => {
          alert('Campaña aprobada y publicada con éxito.');
          this.loadPendingCampaigns();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error aprobando campaña', err);
          alert('Ocurrió un error al intentar aprobar la campaña.');
        }
      });
    } else {
      this.campaignService.rejectCampaign(this.selectedCampaign.id, this.comment, token).subscribe({
        next: () => {
          alert('Campaña rechazada correctamente.');
          this.loadPendingCampaigns();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error rechazando campaña', err);
          alert('Ocurrió un error al intentar rechazar la campaña.');
        }
      });
    }
  }
}
