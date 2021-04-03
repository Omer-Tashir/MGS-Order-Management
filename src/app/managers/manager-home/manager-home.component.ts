import { Component, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-manager-home',
  templateUrl: './manager-home.component.html',
  styleUrls: ['./manager-home.component.scss'],
  animations: [fadeInOnEnterAnimation()],
})
export class ManagerHomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
