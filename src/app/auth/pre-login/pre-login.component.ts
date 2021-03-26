import { Component, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-pre-login',
  templateUrl: './pre-login.component.html',
  styleUrls: ['./pre-login.component.scss'],
  animations: [fadeInOnEnterAnimation()],
})
export class PreLoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
