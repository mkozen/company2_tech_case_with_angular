import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.signIn(email, password);
    } else {
      // subscribe() is used to listen for the response from the server.

      authObs = this.authService.signUp(email, password);
    }

    authObs.subscribe({
      // completeHandler
      complete: () => {
        console.info('complete');
      },
      // errorHandler
      error: (throwedErrorMessage) => {
        this.isLoading = false;
        this.errorMessage = throwedErrorMessage;
        /*
          - Now we could do that here but handling everything of that here in the component is not necessarily the best possible way of doing that,
          - it moves too much logic into the component, which should primarily focus on updating the UI and not so much about handling the response correctly
          - and that therefore screams for the usage of an rxjs/operator that allows us to handle errors here in the service, in our observable chain we're setting up here,so on this observable.
        */
        // this.errorMessage = `An Error Occurred! ${error.error.error.message}`;
        console.error('error', throwedErrorMessage);
      },
      // nextHandler
      next: (resData) => {
        this.isLoading = false;
        this.router.navigate(['/users']);
        console.log('resData', resData);
      },
    });
    form.reset();
  }
  onHandleError() {
    this.errorMessage = '';
  }
}
