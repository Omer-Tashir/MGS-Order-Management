import { Component, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-agent-home',
  templateUrl: './agent-home.component.html',
  styleUrls: ['./agent-home.component.scss'],
  animations: [fadeInOnEnterAnimation()],
})
export class AgentHomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
