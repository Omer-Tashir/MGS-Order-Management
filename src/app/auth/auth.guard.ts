import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

import { DatabaseService } from '../core/database.service';
import { Manager } from '../models/manager';

@Injectable({
  providedIn: 'root',
})
export class isLoggedInGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.afAuth.authState.subscribe(
        (user) => {
          if (user && user != null) {
            resolve(true);
          } else {
            reject(false);
          }
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class isManagerGuard implements CanActivate {
  constructor(private db: DatabaseService, private afAuth: AngularFireAuth) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.afAuth.authState.subscribe(
        (user) => {
          if (user && user != null) {
            this.db.getManagers().subscribe((managers: Manager[]) => {
              managers.find(m=>m.Manager_Id == user.uid) ? resolve(true) : reject(false);
            },
            (error) => {
              console.log(error);
              reject(false);
            });
          } 
          else {
            reject(false);
          }
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class isAgentGuard implements CanActivate {
  constructor(private db: DatabaseService, private afAuth: AngularFireAuth) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.afAuth.authState.subscribe(
        (user) => {
          if (user && user != null) {
            this.db.getAgents().subscribe((agents: any[]) => {
              agents.find(a=>a.Agent_Id == user.uid) ? resolve(true) : reject(false);
            },
            (error) => {
              console.log(error);
              reject(false);
            });
          } 
          else {
            reject(false);
          }
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }
}