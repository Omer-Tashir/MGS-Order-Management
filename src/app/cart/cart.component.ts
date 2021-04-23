import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CartService } from '../core/cart.service';
import { Item } from '../models/item';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatabaseService } from '../core/database.service';
import { Customer } from '../models/customer';
import { Order } from '../models/order';
import { ItemInOrder } from '../models/item-in-order';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(200 )
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(200, style({opacity: 0})))
    ])
  ]
})
export class CartComponent {
  customer!: Customer;
  items: Array<Item> = new Array<Item>();
  itemsInCart: Array<Item> = new Array<Item>();
  isLoading: boolean = false;
  total: number = 0;
  discount: number = 0;
  totalWithDiscount: number = 0;
  
  constructor(private cartService: CartService, private db: DatabaseService, 
    private afAuth: AngularFireAuth, private location: Location) {
      this.afAuth.authState.subscribe(
        (user) => {
          if (user && user != null) {
            this.db.getCustomers().subscribe((customers: any[]) => {
              this.customer = customers.find(c=>c.Customer_Id == user.uid);
              this.itemsInCart = this.cartService.getCart();
              for(let i=0; i<this.itemsInCart.length; i++) {
                this.total=this.total+(Number(this.itemsInCart[i].Price) * Number(this.itemsInCart[i].Quantity));
                this.discount = this.discount+((Number(this.itemsInCart[i].Price) * Number(this.itemsInCart[i].Quantity)) * (this.customer.Discount / 100));
              }

              this.totalWithDiscount = this.total - this.discount;
            },
            (error) => {
              console.log(error);
            });

            this.db.getItems().subscribe(items => {
              this.items = items;
            });
          } 
        },
        (error) => {
          console.log(error);
        }
      );
  }

  removeItem(item: Item) {
    const index = this.itemsInCart.findIndex(p => (p.Barcode == item.Barcode) && (p.Size == item.Size) && (p.Quantity == item.Quantity));
    if (index !== -1) {
      this.itemsInCart.splice(index, 1);
    }
  }

  clearCart() {
    const confirmAnswer = confirm('בטוח/ה לגבי זה?');
    if(confirmAnswer) {
      let removeStack = this.itemsInCart.map(p => {
        return this.cartService.removeItem(p);
      });
  
      this.isLoading = true;
      Promise.all(removeStack).then(() => {
        this.itemsInCart = [];
        this.isLoading = false;
      }).catch(error => {
        console.log(error);
        this.isLoading = false;
      }); 
    }
  }

  getItemStockQuantity(itemInCart: Item): number {
    return this.items.find(i=>i.Barcode === itemInCart.Barcode)?.Quantity ?? 0;
  }

  purchase(){
    let order = new Order;
    order.Customer_Id = this.customer.Customer_Id;
    order.Date_Received = new Date();
    order.Status = 'ההזמנה התקבלה';

    this.db.putOrder(order).subscribe(result=>{
      let forkArr = [];
      for(let i=0; i<this.itemsInCart.length; i++) {
        let item = this.itemsInCart[i];
        let itemInOrder = new ItemInOrder;
        itemInOrder.Order_Id = result.Order_Id;
        itemInOrder.Quantity = Number(item.Quantity);
        itemInOrder.Price_For_Line = Number(item.Quantity) * Number(item.Price);
        itemInOrder.Barcode = item.Barcode;
        itemInOrder.Size = item.Size;
        forkArr.push(this.db.putItemInOrder(itemInOrder));
        forkArr.push(this.db.updateItemQuantity(this.itemsInCart[i], this.getItemStockQuantity(this.itemsInCart[i]) - this.itemsInCart[i].Quantity));
      }

      forkJoin(forkArr).subscribe(data=>{
        alert('ההזמנה בוצעה בהצלחה');
        this.cartService.removeCart();
        this.location.back();
      }, error=>{
        console.log(error);
        alert('התרחשה שגיאה בקליטת פרטי ההזמנה');
      })
    });
  }

  setDefaultPic(item: Item) {
    item.Image = 'assets/default.jpeg';
  }
}
