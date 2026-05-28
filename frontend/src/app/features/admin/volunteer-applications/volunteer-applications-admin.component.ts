import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin, finalize } from 'rxjs';

import { AdminService } from '../../../core/services/admin.service';
import { VolunteerApplication, VolunteerApplicationStatus } from '../../../core/models/volunteer-application.model';

@Component({
  selector: 'app-volunteer-applications-admin',
  templateUrl: './volunteer-applications-admin.component.html',
  styleUrls: ['./volunteer-applications-admin.component.css'],
  standalone: false
})
export class VolunteerApplicationsAdminComponent implements OnInit {
  applications: VolunteerApplication[] = [];
  allApplications: VolunteerApplication[] = [];
  acceptedApplications: VolunteerApplication[] = [];
  rejectedApplications: VolunteerApplication[] = [];
  isLoading = true;
  activeTab: 'pending' | 'all' = 'pending';
  isSaving: Record<number, boolean> = {};
  rejectionNotes: Record<number, string> = {};
  errorMessage: string | null = null;
  selectedApplication: VolunteerApplication | null = null;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    forkJoin({
      pending: this.adminService.getVolunteerApplicationsByStatus('PENDING'),
      accepted: this.adminService.getVolunteerApplicationsByStatus('ACCEPTED'),
      rejected: this.adminService.getVolunteerApplicationsByStatus('REJECTED')
    })
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: ({ pending, accepted, rejected }) => {
          this.applications = pending;
          this.acceptedApplications = accepted;
          this.rejectedApplications = rejected;
          this.allApplications = [...pending, ...accepted, ...rejected].sort((left, right) => {
            const leftDate = left.fechaPostulacion ? new Date(left.fechaPostulacion).getTime() : 0;
            const rightDate = right.fechaPostulacion ? new Date(right.fechaPostulacion).getTime() : 0;
            return rightDate - leftDate;
          });
          this.errorMessage = null;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'No pudimos cargar las postulaciones.';
          this.cdr.detectChanges();
        }
      });
  }

  setTab(tab: 'pending' | 'all'): void {
    this.activeTab = tab;
  }

  get visibleApplications(): VolunteerApplication[] {
    return this.activeTab === 'pending' ? this.applications : this.allApplications;
  }

  get pendingCount(): number {
    return this.applications.length;
  }

  get totalCount(): number {
    return this.allApplications.length;
  }

  get acceptedCount(): number {
    return this.acceptedApplications.length;
  }

  get rejectedCount(): number {
    return this.rejectedApplications.length;
  }

  approve(applicationId: number): void {
    this.isSaving[applicationId] = true;
    this.adminService.approveVolunteerApplication(applicationId)
      .pipe(finalize(() => {
        this.isSaving[applicationId] = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => this.loadApplications(),
        error: () => {
          this.errorMessage = 'No pudimos aprobar la postulación.';
          this.cdr.detectChanges();
        }
      });
  }

  reject(applicationId: number): void {
    this.isSaving[applicationId] = true;
    const notes = (this.rejectionNotes[applicationId] || '').trim();

    this.adminService.rejectVolunteerApplication(applicationId, notes)
      .pipe(finalize(() => {
        this.isSaving[applicationId] = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => {
          this.rejectionNotes[applicationId] = '';
          this.loadApplications();
        },
        error: () => {
          this.errorMessage = 'No pudimos rechazar la postulación.';
          this.cdr.detectChanges();
        }
      });
  }

  getStatusLabel(status?: VolunteerApplicationStatus): string {
    switch (status) {
      case 'ACCEPTED': return 'Aprobada';
      case 'REJECTED': return 'Rechazada';
      default: return 'Pendiente';
    }
  }

  getCampaignLabel(application: VolunteerApplication): string {
    return `Campaña #${application.campaignId}`;
  }

  viewDetails(application: VolunteerApplication): void {
    this.selectedApplication = application;
  }

  closeDetails(): void {
    this.selectedApplication = null;
  }
}