import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users-options-bar',
  templateUrl: './users-options-bar.component.html',
  styleUrls: ['./users-options-bar.component.css'],
})
export class UsersOptionsBarComponent implements OnInit {

  constructor(
    public userservice: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  handleSearchName = (event: any) => {    
    this.userservice.setState('filterTypes', { searchName: event.target.value });
  };

  handleUserPageLimit = (event: any) => {
    this.userservice.setState('tablePaginationInfo', {
      paginationLimit: event.target.value,
    });
  };

  handleUserStatusFilter = (userNewStatusSelection: string) => {    
    this.userservice.setState('filterTypes', {
      userStatusFilter: userNewStatusSelection,
    });
  };

  handleClearFilters = () => {
    this.userservice.resetState();
  };

  onNewUser() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
