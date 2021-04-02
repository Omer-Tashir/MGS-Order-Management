import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpErrorResponse } from '@angular/common/http';

import { DatabaseService } from '../core/database.service';
import { CartService } from '../core/cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private db: DatabaseService,
    private router: Router
  ) {}

  login(email: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth
        .signInWithEmailAndPassword(email, password)
        .then((auth) => resolve(auth.user))
        .catch((error) => {
          reject(error);
        });
    });
  }

  logout(error?: HttpErrorResponse | undefined) {
    if (error != undefined) {
      console.log(error);
    }

    this.router.navigate(['pre-login']);
  }
}
