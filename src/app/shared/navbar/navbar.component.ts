import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { DataStorageService } from '../data-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isUserAuthenticated = false;
  private userAuthSub!: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userAuthSub = this.authService.authUserSubject.subscribe(
      (authUser) => {
        this.isUserAuthenticated = !!authUser; // !authUser ? false : true;
      }
    );
  }

  onSaveData() {
    this.dataStorageService.storeUsers();
  }
  onFetchData() {
    this.dataStorageService.fetchUsers().subscribe();
  }

  onSignOut() {
    this.authService.signOut();
  }

  ngOnDestroy(): void {
    this.userAuthSub.unsubscribe();
  }
}
