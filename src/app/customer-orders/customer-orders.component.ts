import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { DatabaseService } from '../core/database.service';
import { Order } from '../models/order';
import { Item } from '../models/item';
import { ItemInOrder } from '../models/item-in-order';
import { Customer } from '../models/customer';
import { AngularFireAuth } from '@angular/fire/auth';
import { CartService } from '../core/cart.service';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.scss']
})
export class CustomerOrdersComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  
  orders$!: Observable<Order[]>;
  items$!: Observable<Item[]>;
  itemsInOrder$!: Observable<ItemInOrder[]>;

  customer!: Customer;
  displayedColumns: string[] = ['Order_Id', 'Date_Received', 'Status', 'Items'];
  dataSource!: MatTableDataSource<any>;
  dailyOrders: Order[] = [];
  isLoadingData: boolean = true;

  constructor(private afAuth: AngularFireAuth, private db: DatabaseService, 
    private cartService: CartService) {}

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a: Order, b: Order) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Order_Id': return this.compare(a.Order_Id, b.Order_Id, isAsc);
        case 'Date_Received': return this.compare(a.Date_Received.getTime(), b.Date_Received.getTime(), isAsc);
        case 'Status': return this.compare(a.Status, b.Status, isAsc);
        default: return 0;
      }
    });
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  uidTrack(index: any, order: Order) {
    return order.Order_Id;
  }

  getItemsInOrder(order: Order, items: Item[], itemsInOrder: ItemInOrder[]): Item[] {
    let ids = itemsInOrder.filter(i=>i.Order_Id === order.Order_Id).map(i=>i.Barcode);
    return items.filter(i=>ids.includes(i.Barcode)).map(function(item){
      let itemInOrder = itemsInOrder.find(i=>i.Barcode == item.Barcode);
      if(itemInOrder) {
        item.Quantity = itemInOrder.Quantity;
        item.Size = itemInOrder.Size;
      }
      return item;
    });
  }

  ngOnInit(): void {
    this.orders$ = this.db.getOrders();
    this.items$ = this.db.getItems();
    this.itemsInOrder$ = this.db.getItemsInOrder();

    this.afAuth.authState.subscribe(
      (user) => {
        if (user && user != null) {
          this.db.getCustomers().subscribe((customers: any[]) => {
            this.customer = customers.find(c=>c.Customer_Id == user.uid);

            forkJoin([
              this.orders$,
              this.items$,
              this.itemsInOrder$
            ]).subscribe(data => {
              let orders = data[0].filter(o=>o.Customer_Id == this.customer.Customer_Id);
              for(let i=0; i<orders.length; i++) {
                orders[i].items = this.getItemsInOrder(orders[i], data[1], data[2]);
                orders[i].total = (1 - (this.customer.Discount / 100)) * orders[i].items.reduce((acc, i)=>{
                  return acc + (Number(i.Price) * Number(i.Quantity));
                }, 0);
              }

              this.dataSource = new MatTableDataSource(orders);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.sortData({ active: 'Date_Received', direction: 'desc' });
        
            }, error => {
              alert("התרחשה שגיאה, לא ניתן לטעון נתונים");
              console.log(error);
            });
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

  duplicateOrder(order: Order) {
    for(let i=0; i<order.items.length; i++) {
      this.cartService.addItem(order.items[i]);
    }
  }

  setDefaultPic(item: Item) {
    item.Image = 'assets/default.jpeg';
  }
}
