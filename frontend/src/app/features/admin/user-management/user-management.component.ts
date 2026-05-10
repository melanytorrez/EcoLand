import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../core/models/user.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  standalone: false
})
export class UserManagementComponent implements OnInit {
  pendingRequests: User[] = [];
  allUsers: User[] = [];
  isLoading = true;
  activeTab: 'requests' | 'users' = 'requests';
  selectedUser: User | null = null;
  showDetailsModal = false;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.adminService.getPendingLeaderRequests()
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (requests: any[]) => {
          this.pendingRequests = requests.map(r => ({
            ...r,
            promotionStatus: r.estadoSolicitud || r.promotionStatus
          }));
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error loading requests', err)
      });

    this.adminService.getAllUsers().subscribe({
      next: (users: any[]) => {
        this.allUsers = users.map(u => ({
          ...u,
          promotionStatus: u.estadoSolicitud || u.promotionStatus
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading users', err)
    });
  }

  approveRequest(userId: number): void {
    this.adminService.approveLeaderRequest(userId).subscribe({
      next: () => {
        this.loadData();
        // Show success toast
      },
      error: (err) => console.error('Error approving request', err)
    });
  }

  rejectRequest(userId: number): void {
    this.adminService.rejectLeaderRequest(userId).subscribe({
      next: () => {
        this.loadData();
        // Show success toast
      },
      error: (err) => console.error('Error rejecting request', err)
    });
  }

  viewDetails(user: User): void {
    this.selectedUser = user;
    this.showDetailsModal = true;
    this.cdr.detectChanges();
  }

  closeDetails(): void {
    this.selectedUser = null;
    this.showDetailsModal = false;
    this.cdr.detectChanges();
  }
}
