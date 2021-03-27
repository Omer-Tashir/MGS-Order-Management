import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DatabaseService } from '../core/database.service';
import { Item } from '../models/item';
import { AddToCartDialog } from './add-to-cart-dialog/add-to-cart.dialog';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products$!: Observable<Item[]>;
  categories!: Set<string>;
  activeCategory: string = 'כל הקטגוריות';

  constructor(private dbService: DatabaseService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.products$ = this.dbService.getItems()
      .pipe(
        tap(items=>{
          this.categories = new Set(['כל הקטגוריות'].concat(items.map(i=>i.Category).sort()));
        })
      );
  }

  filterByCategory(products: Item[], category: string) {
    if(category=='כל הקטגוריות') {
      return products;
    }

    return products.filter(p=>p.Category==category);
  }

  activateCategory(category: string) {
    this.activeCategory = category;
  }

  setDefaultPic(item: Item) {
    item.Image = 'assets/default.jpeg';
  }

  addToCart(item:Item) {
    const dialogRef = this.dialog.open(AddToCartDialog, {
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
