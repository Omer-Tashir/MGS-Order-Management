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

import * as moment from 'moment/moment';
import { AlgoParameters } from 'src/app/models/algo-parameters';

@Component({
  selector: 'app-priority-report',
  templateUrl: './priority-report.component.html',
  styleUrls: ['./priority-report.component.scss']
})
export class PriorityReportComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  
  customers$!: Observable<Customer[]>;
  orders$!: Observable<Order[]>;
  items$!: Observable<Item[]>;
  itemsInOrder$!: Observable<ItemInOrder[]>;
  algoParameters$!: Observable<AlgoParameters>;

  customers: Customer[] = [];
  displayedColumns: string[] = ['Priority', 'Customer_Name', 'Order_Id', 'Price', 'Date_Received', 'Region'];
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
        case 'Priority': return this.compare(a.Order_Rate, b.Order_Rate, isAsc);
        case 'Customer_Name': return this.compare(this.getCustomerByOrder(a)?.Name, this.getCustomerByOrder(b)?.Name, isAsc) 
        case 'Order_Id': return this.compare(a.Order_Id, b.Order_Id, isAsc);
        case 'Price': return this.compare(a.total, b.total, isAsc);
        case 'Date_Received': return this.compare(a.Date_Received.getTime(), b.Date_Received.getTime(), isAsc);
        case 'Region': return this.compare(this.getCustomerByOrder(a)?.Region, this.getCustomerByOrder(b)?.Region, isAsc) 
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
    this.algoParameters$ = this.db.getAlgoParameters();

    forkJoin([
      this.customers$,
      this.orders$,
      this.items$,
      this.itemsInOrder$,
      this.algoParameters$

    ]).subscribe(data => {
      this.customers = data[0];
      let orders = data[1];
      let algoParameters = data[4];

      for(let i=0; i<orders.length; i++) {
        orders[i].items = this.getItemsInOrder(orders[i], data[2], data[3]);
        let customer = this.getCustomerByOrder(orders[i]);
        if (customer) {
          orders[i].total = (1 - (customer.Discount / 100)) * orders[i].items.reduce((acc, i)=>{
            return acc + (Number(i.Price) * Number(i.Quantity));
          }, 0);
          orders[i].Order_Rate = this.getAlgorithemScore(orders[i], customer, algoParameters);
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

  getAlgorithemScore(order: Order, customer: Customer, algoParameters: AlgoParameters): number {
    let totalPriceScore: number = 0;
    if(order.total<=5000) {
      totalPriceScore = 2.5;
    }
    else if(order.total>5000 && order.total<=15000) {
      totalPriceScore = 5;
    }
    else if(order.total>15000 && order.total<=25000) {
      totalPriceScore = 7.5;
    }
    else if(order.total>25000) {
      totalPriceScore = 10;
    }

    let orderItemsScore: number = 0;
    if(order.items.length<=500) {
      orderItemsScore = 3;
    }
    else if(order.items.length>500 && order.items.length<=1000) {
      orderItemsScore = 6.5;
    }
    else if(order.items.length>1000) {
      orderItemsScore = 10;
    }

    let timeInSystemScore: number = 0;
    let days = moment(order.Date_Received).diff(moment(new Date()), 'days');
    if(days<=4) {
      timeInSystemScore = 3;
    }
    else if(days>4 && days<=8) {
      timeInSystemScore = 6.5
    }
    else if(days>8) {
      timeInSystemScore = 10;
    }

    let totalTimeInSystemScore: number = timeInSystemScore * algoParameters.OrderTimeInSystem;
    let totalCustomerScore: number = algoParameters.Customer * (
      algoParameters.CustomerQuality * customer.Quality_Rate +
      algoParameters.CustomerObligo * customer.Obligo_Rate +
      algoParameters.CustomerSeniority * customer.Seniority_Rate
    );
    let totalOrderScore: number = algoParameters.Order * (
      algoParameters.OrderItemsQuantity * orderItemsScore +
      algoParameters.OrderTotalPrice * totalPriceScore
    );

    return totalTimeInSystemScore + totalCustomerScore + totalOrderScore;
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

