import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fadeInOnEnterAnimation } from 'angular-animations';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [fadeInOnEnterAnimation()],
})
export class LoginComponent implements OnInit {
  logo: string = 'assets/logo.png';
  background: string = 'assets/backgroud.png';
  isLoading: boolean = false;
  formGroup: FormGroup;
  loginType: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      this.loginType = params['type'];
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
        if(this.loginType=='customers') {
          this.router.navigate(['/customer-home']);
        }
        else if(this.loginType=='agents') {
          this.router.navigate(['/agent-home']);
        }
        else if(this.loginType=='managers') {
          this.router.navigate(['/manager-home']);
        }
      })
      .catch((error) => {
        alert('שם המשתמש והסיסמה אינם נכונים')
        console.log(error);
        this.isLoading = false;
      });
  }
}
