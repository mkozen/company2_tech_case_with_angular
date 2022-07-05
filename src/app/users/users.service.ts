import { Users } from './users.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { SelectedUsers } from '../shared/selected-users.model';
import { SelectedUsersPoolService } from '../selected-users-pool/selected-users-pool.service';
import { DataStorageService } from '../shared/data-storage.service';
@Injectable({ providedIn: 'root' })
export class UsersService {
  initialState = {
    filterTypes: {
      searchName: '',
      userStatusFilter: '',
    },
    tablePaginationInfo: {
      defaultPaginationLimit: 6,
      paginationLimit: 6,
      paginationOffset: 0,
      currentPage: 1,
      tableTotalPages: 1,
    },
    nonFilteredUsersTableData: [],
    filteredUsersTableData: [],
  };
  tableParameters: any = this.initialState;
  private _tableState = new BehaviorSubject<any>(this.initialState);
  get tableState$() {
    return this._tableState.asObservable();
  }
  setState(propName: string, prop2: any) {
    this.tableParameters = {
      ...this.tableParameters,
      [propName]: { ...this.tableParameters[propName], ...prop2 },
    };
    this.updateFilteredUsersTableData();
  }
  resetState() {
    this.tableParameters = this.initialState;
    this._tableState.next(this.initialState);
  }
  constructor(
    private dataStorageService: DataStorageService,
    private selectedUsersPoolService: SelectedUsersPoolService
  ) {
    this.dataStorageService.fetchUsers().subscribe((users: Users[]) => {
      this.setUsers(users);
    });
  }

  storeUsers() {
    this.dataStorageService.storeUsers(
      this.tableParameters.nonFilteredUsersTableData
    );
  }
  // Get All Table Data
  getAllTableParameters() {
    return this.tableParameters;
  }

  // Get User/Users Data
  getUsers() {
    return this.tableParameters.nonFilteredUsersTableData!.slice();
  }

  getUser(ID: number) {
    return this.tableParameters.nonFilteredUsersTableData.find(
      (user: Users) => {
        return user.userID == ID;
      }
    );
  }
  // Update Table Data

  updateTablePaginationInfoOffset() {
    this.tableParameters.tablePaginationInfo.paginationOffset =
      (this.tableParameters.tablePaginationInfo.currentPage - 1) *
      this.tableParameters.tablePaginationInfo.paginationLimit;
  }

  updateUserTablePagination(newValue: number) {
    this.tableParameters.tablePaginationInfo.tableTotalPages =
      Math.ceil(newValue);
    if (this.tableParameters.tablePaginationInfo.currentPage > newValue) {
      this.tableParameters.tablePaginationInfo.currentPage = newValue;
      this.updateFilteredUsersTableData();
    }
    if (this.tableParameters.tablePaginationInfo.currentPage <= 0)
      this.tableParameters.tablePaginationInfo.currentPage = 1;
    this.updateTablePaginationInfoOffset();
  }

  updateFilteredUsersTableData() {
    let filteredUsers = this.tableParameters.nonFilteredUsersTableData.filter(
      (user: Users) => {
        return (
          user.userName
            .toLowerCase()
            .includes(
              this.tableParameters.filterTypes.searchName.toLowerCase()
            ) &&
          user.userStatus
            .toLowerCase()
            .includes(
              this.tableParameters.filterTypes.userStatusFilter.toLowerCase()
            )
        );
      }
    );
    this.updateUserTablePagination(
      Math.ceil(
        filteredUsers.length /
          this.tableParameters.tablePaginationInfo.paginationLimit
      )
    );
    this.tableParameters.filteredUsersTableData = filteredUsers?.filter(
      (user: any, index: number) => {
        return (
          index >=
            Number(this.tableParameters.tablePaginationInfo.paginationOffset) &&
          index <
            Number(this.tableParameters.tablePaginationInfo.paginationLimit) +
              Number(this.tableParameters.tablePaginationInfo.paginationOffset)
        );
      }
    );
    this._tableState.next(this.tableParameters);
  }

  addUser(newUser: any) {
    this.tableParameters.nonFilteredUsersTableData.push(newUser);
    this.updateFilteredUsersTableData();
  }

  updateUserData(id: number, updatedUserInformations: any) {
    let updateUserIndex =
      this.tableParameters.nonFilteredUsersTableData.findIndex((user: any) => {
        return user.userID === id;
      });
    this.tableParameters.nonFilteredUsersTableData[updateUserIndex] = {
      ...this.tableParameters.nonFilteredUsersTableData[updateUserIndex],
      ...updatedUserInformations,
    };
    this.updateFilteredUsersTableData();
  }

  deleteUser(id: number) {
    this.tableParameters.nonFilteredUsersTableData.splice(
      this.tableParameters.nonFilteredUsersTableData.findIndex(
        (user: Users) => user.userID === id
      ),
      1
    );
    this.updateFilteredUsersTableData();
  }

  addSelectedUserToSelectedUsersPool(selectedUser: SelectedUsers | any) {
    // console.log('selectedUserusersservşce', selectedUser);
    this.selectedUsersPoolService.addRegisteredSelectedUser(selectedUser);
  }
  // Set Users Via Backend
  setUsers(users: Users[]) {
    this.tableParameters.nonFilteredUsersTableData = users;
    this.tableParameters.filteredUsersTableData = users;
    this.updateFilteredUsersTableData();
  }
}
