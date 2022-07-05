import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Users } from '../users/users.model';

@Injectable({ providedIn: 'root' })
export class DataStorageService implements OnInit {
  constructor(private http: HttpClient, private authService: AuthService) {}
  ngOnInit(): void {
    // console.log('getusers', this.userService.getUsers());
  }
  storeUsers(users: Users[]) {
    this.http
      .put(
        'https://ng-practice-usercrud-barisd-default-rtdb.europe-west1.firebasedatabase.app/users.json',
        users
      )
      .subscribe((response) => {
        console.log('response', response);
      });
  }
  fetchUsers() {
    return this.http
      .get<Users[]>(
        'https://ng-practice-usercrud-barisd-default-rtdb.europe-west1.firebasedatabase.app/users.json'
      )
      .pipe(
        map((users) => {
          return users.map((user) => {
            return {
              ...user,
              userCourses: user.userCourses ? user.userCourses : [],
            };
          });
        })
      );
  }
}
