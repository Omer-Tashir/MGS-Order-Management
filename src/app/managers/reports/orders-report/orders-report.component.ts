import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AngularFireAuth } from '@angular/fire/auth';

import { Order } from 'src/app/models/order';
import { Item } from 'src/app/models/item';
import { ItemInOrder } from 'src/app/models/item-in-order';
import { Customer } from 'src/app/models/customer';
import { DatabaseService } from 'src/app/core/database.service';
import { CartService } from 'src/app/core/cart.service';

@Component({
  selector: 'app-orders-report',
  templateUrl: './orders-report.component.html',
  styleUrls: ['./orders-report.component.scss']
})
export class OrdersReportComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  
  customers$!: Observable<Customer[]>;
  orders$!: Observable<Order[]>;
  items$!: Observable<Item[]>;
  itemsInOrder$!: Observable<ItemInOrder[]>;

  customers: Customer[] = [];
  displayedColumns: string[] = ['Customer_Name', 'Order_Id', 'Price', 'Date_Received', 'Region', 'Status'];
  dataSource!: MatTableDataSource<any>;
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
        case 'Customer_Name': return this.compare(this.getCustomerByOrder(a)?.Name, this.getCustomerByOrder(b)?.Name, isAsc) 
        case 'Order_Id': return this.compare(a.Order_Id, b.Order_Id, isAsc);
        case 'Price': return this.compare(a.total, b.total, isAsc);
        case 'Date_Received': return this.compare(a.Date_Received.getTime(), b.Date_Received.getTime(), isAsc);
        case 'Region': return this.compare(this.getCustomerByOrder(a)?.Region, this.getCustomerByOrder(b)?.Region, isAsc) 
        case 'Status': return this.compare(a.Status, b.Status, isAsc);
        default: return 0;
      }
    });
  }

  private compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  uidTrack(index: any, order: Order) {
    return order.Order_Id;
  }

  getItemsInOrder(order: Order, items: Item[], itemsInOrder: ItemInOrder[]): Item[] {
    let orderItems = itemsInOrder.filter(i=>i.Order_Id === order.Order_Id);
    let arr: Item[] = [];
    for(let i=0; i<orderItems.length; i++) {
      let item = Object.assign(new Item, items.find(item=>item.Barcode == orderItems[i].Barcode));
      if (item) {
        item.Quantity = orderItems[i].Quantity;
        item.Size = orderItems[i].Size;
        arr.push(item);
      }
    }
    return arr;
  }

  ngOnInit(): void {
    this.customers$ = this.db.getCustomers();
    this.orders$ = this.db.getOrders();
    this.items$ = this.db.getItems();
    this.itemsInOrder$ = this.db.getItemsInOrder();

    forkJoin([
      this.customers$,
      this.orders$,
      this.items$,
      this.itemsInOrder$
    ]).subscribe(data => {
      this.customers = data[0];
      let orders = data[1];
      for(let i=0; i<orders.length; i++) {
        orders[i].items = this.getItemsInOrder(orders[i], data[2], data[3]);
        let customer = this.getCustomerByOrder(orders[i]);
        if (customer) {
          orders[i].total = (1 - (customer.Discount / 100)) * orders[i].items.reduce((acc, i)=>{
            return acc + (Number(i.Price) * Number(i.Quantity));
          }, 0);
        }
      }

      this.dataSource = new MatTableDataSource(orders);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.sortData({ active: 'Date_Received', direction: 'desc' });

    }, error => {
      alert("התרחשה שגיאה, לא ניתן לטעון נתונים");
      console.log(error);
    });
  }

  getCustomerByOrder(order: Order): Customer | undefined {
    return this.customers.find(c=>c.Customer_Id==order.Customer_Id);
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
