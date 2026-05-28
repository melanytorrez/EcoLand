import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AdminService } from '../../../core/services/admin.service';
import { VolunteerApplication, VolunteerApplicationStatus } from '../../../core/models/volunteer-application.model';

@Component({
  selector: 'app-volunteer-applications-admin',
  templateUrl: './volunteer-applications-admin.component.html',
  standalone: false
})
export class VolunteerApplicationsAdminComponent implements OnInit {
  applications: VolunteerApplication[] = [];
  isLoading = true;
  isSaving: Record<number, boolean> = {};
  rejectionNotes: Record<number, string> = {};
  errorMessage: string | null = null;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.adminService.getVolunteerApplicationsByStatus('PENDING')
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (applications) => {
          this.applications = applications;
          this.errorMessage = null;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'No pudimos cargar las postulaciones.';
          this.cdr.detectChanges();
        }
      });
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
}