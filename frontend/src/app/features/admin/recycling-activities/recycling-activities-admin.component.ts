import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin, finalize } from 'rxjs';

import { AdminService } from '../../../core/services/admin.service';
import { RecyclingActivity, RecyclingActivityStatus } from '../../../core/models/recycling.model';

@Component({
  selector: 'app-recycling-activities-admin',
  templateUrl: './recycling-activities-admin.component.html',
  standalone: false
})
export class RecyclingActivitiesAdminComponent implements OnInit {
  pendingActivities: RecyclingActivity[] = [];
  approvedActivities: RecyclingActivity[] = [];
  rejectedActivities: RecyclingActivity[] = [];
  allActivities: RecyclingActivity[] = [];
  activeTab: 'pending' | 'all' = 'pending';
  isLoading = true;
  isSaving: Record<number, boolean> = {};
  rejectionNotes: Record<number, string> = {};
  errorMessage: string | null = null;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.isLoading = true;
    forkJoin({
      pending: this.adminService.getRecyclingActivitiesByStatus('PENDING'),
      approved: this.adminService.getRecyclingActivitiesByStatus('APPROVED'),
      rejected: this.adminService.getRecyclingActivitiesByStatus('REJECTED')
    })
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: ({ pending, approved, rejected }) => {
          this.pendingActivities = pending;
          this.approvedActivities = approved;
          this.rejectedActivities = rejected;
          this.allActivities = [...pending, ...approved, ...rejected].sort((left, right) => {
            const leftDate = left.registeredAt ? new Date(left.registeredAt).getTime() : 0;
            const rightDate = right.registeredAt ? new Date(right.registeredAt).getTime() : 0;
            return rightDate - leftDate;
          });
          this.errorMessage = null;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'No pudimos cargar las actividades de reciclaje.';
          this.cdr.detectChanges();
        }
      });
  }

  setTab(tab: 'pending' | 'all'): void {
    this.activeTab = tab;
  }

  get visibleActivities(): RecyclingActivity[] {
    return this.activeTab === 'pending' ? this.pendingActivities : this.allActivities;
  }

  get pendingCount(): number {
    return this.pendingActivities.length;
  }

  get totalCount(): number {
    return this.allActivities.length;
  }

  get approvedCount(): number {
    return this.approvedActivities.length;
  }

  approve(activityId: number): void {
    this.isSaving[activityId] = true;
    this.adminService.approveRecyclingActivity(activityId)
      .pipe(finalize(() => {
        this.isSaving[activityId] = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => this.loadActivities(),
        error: () => {
          this.errorMessage = 'No pudimos aprobar la actividad.';
          this.cdr.detectChanges();
        }
      });
  }

  reject(activityId: number): void {
    this.isSaving[activityId] = true;
    const notes = (this.rejectionNotes[activityId] || '').trim();

    this.adminService.rejectRecyclingActivity(activityId, notes)
      .pipe(finalize(() => {
        this.isSaving[activityId] = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => {
          this.rejectionNotes[activityId] = '';
          this.loadActivities();
        },
        error: () => {
          this.errorMessage = 'No pudimos rechazar la actividad.';
          this.cdr.detectChanges();
        }
      });
  }

  getStatusLabel(status: RecyclingActivityStatus): string {
    switch (status) {
      case 'APPROVED': return 'Aprobada';
      case 'REJECTED': return 'Rechazada';
      default: return 'Pendiente';
    }
  }
}
