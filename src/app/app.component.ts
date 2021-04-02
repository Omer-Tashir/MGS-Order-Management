import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { CartService } from './core/cart.service';

import * as moment from 'moment/moment';

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

  constructor(private cartService: CartService, private location: Location) {
    moment.locale("he");

    if(this.cartService.getLength() > 0) {
      console.log('Your Cart:', cartService.getCart());
    }
  }

  getCartLength(): number {
    return this.cartService.getLength();
  }

  goBack() {
    this.location.back();
  }
}
