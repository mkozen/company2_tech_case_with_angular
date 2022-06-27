import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SelectedUsers } from '../shared/selected-users.model';

@Injectable({
  providedIn: 'root',
})
export class SelectedUsersPoolService {
  selectedUsersChanged = new Subject<SelectedUsers[]>();
  startedEditing = new Subject<number>();
  private selectedUsers: SelectedUsers[] = [];
  constructor() {}

  getSelectedUsers() {
    return this.selectedUsers.slice();
  }

  getSelectedUser(userID: number) {
    let selectedUserIndex = this.selectedUsers.findIndex(
      (user: SelectedUsers) => user.userID === userID
    );

    return this.selectedUsers[selectedUserIndex];
  }

  addRegisteredSelectedUser(user: SelectedUsers) {
    this.selectedUsers.push({ ...user, userIsRegistered: true });
    this.selectedUsersChanged.next(this.selectedUsers.slice());
    // *****alternatif ama uzun yol*****
    // for (let user of users) {
    //   this.addSelectedUsers(user);
    // }
    // this.selectedUsersChanged.next(this.selectedUsers.slice());
  }

  addNonRegisteredSelectedUser(user: SelectedUsers) {
    this.selectedUsers.push({ ...user, userIsRegistered: false });
    this.selectedUsersChanged.next(this.selectedUsers.slice());
  }

  updateSelectedUser(editedItemId: number, newSelectedUser: SelectedUsers) {
    let findUserIndex;
    if (editedItemId == newSelectedUser.userID) {
      findUserIndex = this.selectedUsers.findIndex(
        (user: SelectedUsers) => user.userID === newSelectedUser.userID
      );
      this.selectedUsers[findUserIndex] = newSelectedUser;
      this.selectedUsersChanged.next(this.selectedUsers.slice());
    } else {
      findUserIndex = this.selectedUsers.findIndex(
        (user: SelectedUsers) => user.userID === editedItemId
      );
      this.selectedUsers[findUserIndex] = newSelectedUser;
      this.selectedUsersChanged.next(this.selectedUsers.slice());
    }
  }

  deleteSelectedUser(userID: number) {
    let findUserIndex = this.selectedUsers.findIndex(
      (user: SelectedUsers) => user.userID === userID
    );
    // console.log('deletefinduserındex', findUserIndex);
    this.selectedUsers.splice(findUserIndex, 1);
    this.selectedUsersChanged.next(this.selectedUsers.slice());
  }
}
