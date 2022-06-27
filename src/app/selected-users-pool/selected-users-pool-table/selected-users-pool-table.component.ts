import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SelectedUsers } from 'src/app/shared/selected-users.model';
import { SelectedUsersPoolService } from '../selected-users-pool.service';

@Component({
  selector: 'app-selected-users-pool-table',
  templateUrl: './selected-users-pool-table.component.html',
  styleUrls: ['./selected-users-pool-table.component.css'],
})
export class SelectedUsersPoolTableComponent implements OnInit, OnDestroy {
  selectedUsers!: SelectedUsers[];
  private subscription!: Subscription;

  constructor(private selectedUsersPoolService: SelectedUsersPoolService) {}

  ngOnInit(): void {
    this.selectedUsers = this.selectedUsersPoolService.getSelectedUsers();
    // console.log('this.selectedUsers', this.selectedUsers);
    this.subscription =
      this.selectedUsersPoolService.selectedUsersChanged.subscribe(
        (selectedUsers: SelectedUsers[]) => {
          this.selectedUsers = selectedUsers;
        }
      );
  }
  onEditItem(id: number) {
    this.selectedUsersPoolService.startedEditing.next(id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
