import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { CartService } from './core/cart.service';

import * as moment from 'moment/moment';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatabaseService } from './core/database.service';
import { concat, forkJoin, merge } from 'rxjs';
import { filter, map, mergeAll, mergeMap, tap } from 'rxjs/operators';
import { Customer } from './models/customer';
import { Manager } from './models/manager';
import { Router } from '@angular/router';
import { Agent } from './models/agent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation()
  ]
})
export class AppComponent {
  date: Date = new Date();
  customer: Customer | any;
  agent: Agent | any;
  manager: Manager | any;

  constructor(private router: Router, private cartService: CartService, private location: Location, 
    private db: DatabaseService, private afAuth: AngularFireAuth) {

    moment.locale("he");

    if(this.cartService.getLength() > 0) {
      console.log('Your Cart:', cartService.getCart());
    }

    this.afAuth.authState.subscribe(
      (user) => {
        if (user && user != null) {
          forkJoin([
            this.db.getCustomers(),
            this.db.getAgents(),
            this.db.getManagers()
          ]).subscribe(
            result => {
              console.log(result);
              if(result[0].find(r=>r.Customer_Id === user.uid)) {
                this.customer = result[0].find(r=>r.Customer_Id === user.uid);
              }
              else if(result[1].find(r=>r.Agent_Id === user.uid)) {
                this.agent = result[1].find(r=>r.Agent_Id === user.uid);
              }
              else if(result[2].find(r=>r.Manager_Id === user.uid)) {
                this.manager = result[2].find(r=>r.Manager_Id === user.uid);
              }
            },
            (error) => {
              console.log(error);
            }
          );
        } 
      },
      (error) => {
        console.log(error);
      }
    );
  }

  goHome() {
    if(this.customer) {
      this.router.navigate(['customer-home']);
    }
    else if(this.agent) {
      this.router.navigate(['agent-home']);
    }
    else if(this.manager) {
      this.router.navigate(['manager-home']);
    }
  }

  getCartLength(): number {
    return this.cartService.getLength();
  }

  goBack() {
    this.location.back();
  }

  logout() {
    this.afAuth.signOut().then(()=>{
      this.router.navigate(['/']);
    });
  }
}
