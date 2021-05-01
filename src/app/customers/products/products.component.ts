import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CartService } from '../../core/cart.service';
import { DatabaseService } from '../../core/database.service';
import { AddToCartDialog } from './add-to-cart-dialog/add-to-cart.dialog';
import { Item } from '../../models/item';
import { AngularFireAuth } from '@angular/fire/auth';
import { Customer } from 'src/app/models/customer';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  customer!: Customer;
  products$!: Observable<Item[]>;
  categories!: Set<string>;
  activeCategory: string = 'כל הקטגוריות';

  constructor(private dbService: DatabaseService, private afAuth: AngularFireAuth,
    private cartService: CartService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(
      (user) => {
        if (user && user != null) {
          this.dbService.getCustomers().subscribe((customers: any[]) => {
            this.customer = customers.find(c=>c.Customer_Id == user.uid);
            this.products$ = this.dbService.getItems()
            .pipe(
              map(items=>items.filter(i=>i.Class.some(c=>this.customer.Type.indexOf(c) >= 0))),
              tap(items=>{
                this.categories = new Set(['כל הקטגוריות'].concat(items.map(i=>i.Category).sort()));
              })
            );
          },
          (error) => {
            console.log(error);
          });
        } 
      },
      (error) => {
        console.log(error);
      }
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
      let addedItem = Object.assign(new Item, item);
      addedItem.Size = result.size;
      addedItem.Quantity = result.quantity;
      
      this.cartService.addItem(addedItem).then(()=>{
        console.log('הפריטים הוכנסו לעגלה בהצלחה');
      }).catch(error=>{
        console.log(error);
        alert('שגיאה, פריט זה כבר הוכנס לעגלה עבור המידה והכמות הרצויים');
      })
    });
  }
}
