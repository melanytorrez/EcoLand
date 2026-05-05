import { Component, OnInit } from '@angular/core';
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

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.adminService.getPendingLeaderRequests()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (requests) => this.pendingRequests = requests,
        error: (err) => console.error('Error loading requests', err)
      });

    this.adminService.getAllUsers().subscribe({
      next: (users) => this.allUsers = users,
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
}
