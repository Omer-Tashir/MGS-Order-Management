import { Component, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  animations: [fadeInOnEnterAnimation()],
})
export class ReportsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
