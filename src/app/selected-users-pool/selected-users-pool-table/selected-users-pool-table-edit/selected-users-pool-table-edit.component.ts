import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SelectedUsers } from 'src/app/shared/selected-users.model';
import { Users } from 'src/app/users/users.model';
import { UsersService } from 'src/app/users/users.service';
import { SelectedUsersPoolService } from '../../selected-users-pool.service';

@Component({
  selector: 'app-selected-users-pool-table-edit',
  templateUrl: './selected-users-pool-table-edit.component.html',
  styleUrls: ['./selected-users-pool-table-edit.component.css'],
})
export class SelectedUsersPoolTableEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) supForm!: NgForm;
  subscription!: Subscription;
  editMode = false;
  editedItemId!: number;
  editedItem!: SelectedUsers;

  constructor(
    private supService: SelectedUsersPoolService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.subscription = this.supService.startedEditing.subscribe(
      (id: number) => {
        this.editedItemId = id;
        this.editMode = true;
        this.editedItem = this.supService.getSelectedUser(id);

        console.log('editeditem', this.editedItem);
        this.supForm.setValue({
          userID: this.editedItem.userID,
          userName: this.editedItem.userName,
          userTeam: this.editedItem.userTeam,
          userIsRegistered: this.editedItem.userIsRegistered,
        });
      }
    );
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newSelectedUser = new SelectedUsers(
      value.userID,
      value.userName,
      value.userTeam,
      value.userIsRegistered
    );
    if (this.editMode) {
      this.supService.updateSelectedUser(this.editedItemId, newSelectedUser);
    } else {
      let findOriginalArr = this.usersService.getUsers();
      let findOriginalId = findOriginalArr.find(
        (user: Users) => user.userID == newSelectedUser.userID
      );
      if (findOriginalId) {
        alert('This userId has been taken!');
      } else {
        this.supService.addNonRegisteredSelectedUser(newSelectedUser);
      }
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.supForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.supService.deleteSelectedUser(this.editedItemId);
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
