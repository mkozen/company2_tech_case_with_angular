import { Component, OnInit } from '@angular/core';
import { SelectedUsersPoolService } from '../selected-users-pool.service';
import { Subscription } from 'rxjs';
import { SelectedUsers } from 'src/app/shared/selected-users.model';

@Component({
  selector: 'app-selected-users-pool-header',
  templateUrl: './selected-users-pool-header.component.html',
  styleUrls: ['./selected-users-pool-header.component.css'],
})
export class SelectedUsersPoolHeaderComponent implements OnInit {
  selectedUsersCount!: number;

  constructor(private supService: SelectedUsersPoolService) {}

  subscription!: Subscription;

  ngOnInit(): void {
    this.selectedUsersCount = this.supService.getSelectedUsers().length;
    this.subscription = this.supService.selectedUsersChanged.subscribe(
      (selectedUsers: SelectedUsers[]) => {
        this.selectedUsersCount = selectedUsers.length;
      }
    );
  }
}
