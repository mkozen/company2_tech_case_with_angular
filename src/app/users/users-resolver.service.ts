// A resolver is essentially some code that runs before a route is loaded to ensure that certain data the route depends on is there.
// Alternative: guard or redirection
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { Users } from './users.model';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class UsersResolverService implements Resolve<Users> {
  constructor(
    private dataStorageService: DataStorageService,
    private usersService: UsersService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    // check if users are already in the store
    const users = this.usersService.getUsers();
    if (users.length === 0) {
      return this.dataStorageService.fetchUsers();
    } else {
      return users;
    }
  }
}
