import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Users } from '../../users.model';
import { UsersService } from '../../users.service';

@Component({
  selector: '.app-user-details-header',
  templateUrl: './user-details-header.component.html',
  styleUrls: ['./user-details-header.component.css'],
})
export class UserDetailsHeaderComponent implements OnInit {
  id!: number;
  userDetails!: Users;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.userDetails = this.usersService.getUser(this.id);
    });
  }
}
