import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../core/models/user.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  standalone: false,
  styles: [`
    .btn-approve {
      background-color: #18971eff !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    .btn-approve:hover {
      background-color: #1B5E20 !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 10px 20px -5px rgba(46, 125, 50, 0.4) !important;
    }
    .btn-approve:active {
      transform: scale(0.95) !important;
    }
    .btn-reject {
      background-color: #C62828 !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    .btn-reject:hover {
      background-color: #B71C1C !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 10px 20px -5px rgba(198, 40, 40, 0.4) !important;
    }
    .btn-reject:active {
      transform: scale(0.95) !important;
    }
    .btn-view {
      background-color: #eff6ff !important;
      color: #1d4ed8 !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    .btn-view:hover {
      background-color: #dbeafe !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 10px 20px -5px rgba(29, 78, 216, 0.2) !important;
    }
    .btn-view:active {
      transform: scale(0.95) !important;
    }
  `]
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
  ) { }

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
