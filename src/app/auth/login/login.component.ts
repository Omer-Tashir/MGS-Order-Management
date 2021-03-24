import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fadeInOnEnterAnimation } from 'angular-animations';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [fadeInOnEnterAnimation()],
})
export class LoginComponent {
  logo: string = 'assets/logo.png';
  background: string = 'assets/backgroud.png';
  isLoading: boolean = false;
  formGroup: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  hasError = (controlName: string, errorName: string) => {
    return this.formGroup?.controls[controlName].hasError(errorName);
  };

  submit() {
    this.isLoading = true;
    if (this.formGroup.invalid) {
      this.isLoading = false;
      return;
    }

    this.authService
      .login(
        this.formGroup.get('email')?.value,
        this.formGroup.get('password')?.value
      )
      .then((user) => {
        this.router.navigate(['home']);
      })
      .catch((error) => {
        console.log(error);
        this.isLoading = false;
      });
  }
}
