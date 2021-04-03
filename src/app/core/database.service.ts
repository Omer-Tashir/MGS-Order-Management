import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { from, Observable, of, throwError } from 'rxjs';
import { catchError, first, map, mergeMap, shareReplay } from 'rxjs/operators';

import { Order } from '../models/order';
import { Customer } from '../models/customer';
import { Manager } from '../models/manager';
import { Agent } from '../models/agent';
import { Item } from '../models/item';
import { ItemInOrder } from '../models/item-in-order';
import { AlgoParameters } from '../models/algo-parameters';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private db: AngularFirestore) {}

  getCustomers(): Observable<Customer[]> {
    return this.db.collection(`Customer`).get().pipe(
      map(customers => customers.docs.map(doc => {
        let data: any = doc.data();
        return Object.assign(new Customer(), {
          Customer_Id: doc.id,
          Agent_Id: data.agent_id,
          User_Name: data.user_name,
          Name: data.name,
          Phone_Num: data.phone_num,
          Email: data.email,
          Region: data.region,
          Type: data.type,
          Discount: data.discount,
          Quality_Rate: data.quality_rate,
          Obligo_Rate: data.obligo_rate,
          Seniority_Rate: data.seniority_rate,
        });
      })),
      catchError(err => of([])),
      shareReplay()
    );
  }

  putCustomer(customer: Customer): Observable<Customer> {
    let uid = !!customer?.Customer_Id ? customer.Customer_Id : this.db.createId();
    return from(this.db.collection(`Customer`).doc(uid).set({
      customer_id: uid,
      agent_id: customer.Agent_Id,
      user_name: customer.User_Name,
      name: customer.Name,
      phone_num: customer.Phone_Num,
      email: customer.Email,
      region: customer.Region,
      type: customer.Type,
      discount: customer.Discount,
      quality_rate: customer.Quality_Rate,
      obligo_rate: customer.Obligo_Rate,
      seniority_rate: customer.Seniority_Rate,
    })).pipe(
      map(res => Object.assign(new Customer(), {
        Customer_Id: uid,
        Agent_Id: customer.Agent_Id,
        User_Name: customer.User_Name,
        Name: customer.Name,
        Phone_Num: customer.Phone_Num,
        Email: customer.Email,
        Region: customer.Region,
        Type: customer.Type,
        Discount: customer.Discount,
        Quality_Rate: customer.Quality_Rate,
        Obligo_Rate: customer.Obligo_Rate,
        Seniority_Rate: customer.Seniority_Rate,
      })),
      catchError(err=>throwError(err)),
      shareReplay()
    );
  }

  getOrders(): Observable<Order[]> {
    return this.db.collection(`Order`).get().pipe(
      map(orders => orders.docs.map(doc => {
        let data: any = doc.data();
        return Object.assign(new Order(), {
          Order_Id: doc.id,
          Customer_Id: data.customer_id,
          Status: data.status,
          Date_Received: data.date_received.toDate(),
          Order_Rate: data.order_rate,
        });
      })),
      catchError(err => of([])),
      shareReplay()
    );
  }

  putOrder(order: Order): Observable<Order> {
    let uid = !!order?.Order_Id ? order.Order_Id : this.db.createId();
    return from(this.db.collection(`Order`).doc(uid).set({
      order_id: uid,
      customer_id: order.Customer_Id,
      status: order.Status,
      date_received: order.Date_Received,
      order_rate: order.Order_Rate,
    })).pipe(
      map(res => Object.assign(new Order(), {
        Order_Id: uid,
        Customer_Id: order.Customer_Id,
        Status: order.Status,
        Date_Received: order.Date_Received,
        Order_Rate: order.Order_Rate,
      })),
      catchError(err=>throwError(err)),
      shareReplay()
    );
  }

  getItemsInOrder(): Observable<ItemInOrder[]> {
    return this.db.collection(`ItemInOrder`).get().pipe(
      map(items => items.docs.map(doc => {
        let data: any = doc.data();
        return Object.assign(new ItemInOrder(), {
          Order_Id: data.order_id,
          Barcode: data.barcode,
          Size: data.size,
          Quantity: data.quantity,
          Price_For_Line: data.price_for_line,
        });
      })),
      catchError(err => of([])),
      shareReplay()
    );
  }

  putItemInOrder(item: ItemInOrder): Observable<ItemInOrder> {
    let uid = this.db.createId();
    return from(this.db.collection(`ItemInOrder`).doc(uid).set({
      order_id: item.Order_Id,
      barcode: item.Barcode,
      size: item.Size,
      quantity: item.Quantity,
      price_for_line: item.Price_For_Line,
    })).pipe(
      map(res => Object.assign(new ItemInOrder(), {
        Order_Id: item.Order_Id,
        Barcode: item.Barcode,
        Size: item.Size,
        Quantity: item.Quantity,
        Price_For_Line: item.Price_For_Line,
      })),
      catchError(err=>throwError(err)),
      shareReplay()
    );
  }

  getItems(): Observable<Item[]> {
    return this.db.collection(`Item`).get().pipe(
      map(items => items.docs.map(doc => {
        let data: any = doc.data();
        return Object.assign(new Item(), {
          Barcode: doc.id,
          Quantity: data.quantity,
          Price: data.price,
          Class: data.class,
          Catalog_Num: data.catalog_num,
          Size: data.size,
          Color: data.color,
          Category: data.category,
          Image: data.image,
          Name: data.name,
        });
      })),
      catchError(err => of([])),
      shareReplay()
    );
  }

  getManagers(): Observable<Manager[]> {
    return this.db.collection(`Manager`).get().pipe(
      map(managers => managers.docs.map(doc => {
        let data: any = doc.data();
        return Object.assign(new Manager(), {
          Manager_Id: doc.id
        });
      })),
      catchError(err => of([])),
      shareReplay()
    );
  }

  getAgents(): Observable<Agent[]> {
    return this.db.collection(`Agent`).get().pipe(
      map(agents => agents.docs.map(doc => {
        let data: any = doc.data();
        return Object.assign(new Agent(), {
          Agent_Id: doc.id,
          Region: data.region,
          Discount: data.discount,
          User_Name: data.user_name,
          Name: data.name,
          Phone_Num: data.phone_num,
          Email: data.email,
          Employee_Num: data.employee_num,
          Role: data.role,
        });
      })),
      catchError(err => of([])),
      shareReplay()
    );
  }

  getAlgoParameters(): Observable<AlgoParameters> {
    return this.db.collection(`AlgoParameters`).get().pipe(
      map(parameters => parameters.docs.map(doc => {
        let data: any = doc.data();
        return Object.assign(new AlgoParameters(), {
          uid: doc.id,
          Customer: data.Customer,
          Order: data.Order,

          CustomerObligo: data.CustomerObligo,
          CustomerQuality: data.CustomerQuality,
          CustomerSeniority: data.CustomerSeniority,
          OrderItemsQuantity: data.OrderItemsQuantity,
          OrderTimeInSystem: data.OrderTimeInSystem,
          OrderTotalPrice: data.OrderTotalPrice
        });
      })),
      first(),
      mergeMap(r=>r),
      shareReplay()
    );
  }

  putAlgoParameters(uid: string, data: AlgoParameters): void {
    this.db.collection(`AlgoParameters`).doc(uid).set({
      Customer: data.Customer,
      Order: data.Order,
      
      CustomerObligo: data.CustomerObligo,
      CustomerQuality: data.CustomerQuality,
      CustomerSeniority: data.CustomerSeniority,
      OrderItemsQuantity: data.OrderItemsQuantity,
      OrderTimeInSystem: data.OrderTimeInSystem,
      OrderTotalPrice: data.OrderTotalPrice
    });
  }
}
