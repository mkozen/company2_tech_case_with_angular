import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription, switchMap } from 'rxjs';
import { UsersService } from '../../users.service';
@Component({
  selector: 'app-users-table-pagination',
  templateUrl: './users-table-pagination.component.html',
  styleUrls: ['./users-table-pagination.component.css'],
})
export class UsersTablePaginationComponent implements OnInit {
  constructor(public userService: UsersService) {}
  ngOnInit(): void {
  }
  lastPageNumber:number = 0;
  totalPagesArr$  = this.userService.tableState$.pipe(
    switchMap((state) => {
      this.lastPageNumber = Math.ceil(state.tablePaginationInfo.tableTotalPages);
      return of(Array.from(Array(this.lastPageNumber).keys()));
    })
  );

  handleUserCurrentPage = (pageNumber: number) => {
    this.userService.setState('tablePaginationInfo', {
      currentPage: pageNumber,
    });
    // console.log('pageNumber', pageNumber);
  };
}
