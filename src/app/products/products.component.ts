import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseService } from '../core/database.service';
import { Item } from '../models/item';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products$!: Observable<Item[]>;

  constructor(private dbService: DatabaseService) { }

  ngOnInit(): void {
    this.products$ = this.dbService.getItems();
  }
}
