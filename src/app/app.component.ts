import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'company2_tech_case_with_angular';

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.autoSignIn();
  }
}
