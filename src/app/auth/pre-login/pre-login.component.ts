import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { CartService } from 'src/app/core/cart.service';

@Component({
  selector: 'app-pre-login',
  templateUrl: './pre-login.component.html',
  styleUrls: ['./pre-login.component.scss'],
  animations: [fadeInOnEnterAnimation()],
})
export class PreLoginComponent implements OnInit {

  constructor(private cartService: CartService, private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.afAuth.signOut().then(()=>{
      this.cartService.removeCart();
    }).catch(error=>{
      console.log(error);
    });
  }
}
