import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Users } from '../users.model';
import { UsersService } from '../users.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css'],
})
export class UsersTableComponent implements OnInit, OnDestroy {
  filteredUsersTableData: Users[] | undefined;
  private tableParametersChangedSub!: Subscription;

  constructor(private userService: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.tableParametersChangedSub = this.userService.tableState$.subscribe(
      (newTableParameters) => {
        this.filteredUsersTableData = newTableParameters.filteredUsersTableData;
      }
    );
    this.userService.updateFilteredUsersTableData();
  }

  handleDeleteUser(ID: number): void {
    this.userService.deleteUser(ID);
  }

  onAddToSelectedUsersPool(userID: number) {
    let findUser = this.filteredUsersTableData?.find(
      (user) => user.userID === userID
    );
    let formattedFoundedUser = {
      userID: findUser?.userID,
      userName: findUser?.userName,
      userTeam: 'none',
    };
    this.userService.addSelectedUserToSelectedUsersPool(formattedFoundedUser);
  }

  exportexcel(): void {
    let fileName = 'ExcelSheet.xlsx';
    /* pass here the table id */
    let element = document.getElementById('usersTable');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);
  }

  ngOnDestroy(): void {
    this.tableParametersChangedSub.unsubscribe();
  }
}
