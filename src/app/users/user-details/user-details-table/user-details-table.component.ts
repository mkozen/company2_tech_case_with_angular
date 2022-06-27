import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Users } from '../../users.model';
import { UsersService } from '../../users.service';

@Component({
  selector: 'app-user-details-table',
  templateUrl: './user-details-table.component.html',
  styleUrls: ['./user-details-table.component.css'],
})
export class UserDetailsTableComponent implements OnInit {
  userDetails!: Users;
  ID!: number;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.ID = +params['id'];
      this.userDetails = this.usersService.getUser(this.ID);
    });
  }
}
