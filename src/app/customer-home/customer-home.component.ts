import { Component, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.scss'],
  animations: [fadeInOnEnterAnimation()],
})
export class CustomerHomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
