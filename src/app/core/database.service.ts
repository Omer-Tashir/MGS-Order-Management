import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { Order } from '../models/order';
import { Customer } from '../models/customer';
import { Manager } from '../models/manager';
import { Agent } from '../models/agent';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private db: AngularFirestore) {}

  getCustomers(): Observable<Customer[]> {
    return this.db.collection(`customers`).get().pipe(
      map(customers => customers.docs.map(doc => {
        let data: any = doc.data();
        return Object.assign(new Customer(), {
          Customer_Id: doc.id,
          Agent_Id: data.agent_id,
          Region: data.region,
          Type: data.type,
          Discount: data.discount
        });
      })),
      catchError(err => of([])),
      shareReplay()
    );
  }

  getManagers(): Observable<Manager[]> {
    return this.db.collection(`managers`).get().pipe(
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
    return this.db.collection(`agents`).get().pipe(
      map(agents => agents.docs.map(doc => {
        let data: any = doc.data();
        return Object.assign(new Agent(), {
          Agent_Id: doc.id,
          Region: data.region
        });
      })),
      catchError(err => of([])),
      shareReplay()
    );
  }

  getOrders(): Observable<Order[]> {
    return this.db.collection(`orders`).get().pipe(
      map(orders => orders.docs.map(doc => {
        let data: any = doc.data();
        return Object.assign(new Order(), {
          Order_Id: doc.id,
          Customer_Id: data.customer_id,
          Date_Received: data.date_received.toDate(),
          Status: data.status,
          Order_Rate: data.order_rate
        });
      })),
      catchError(err => of([])),
      shareReplay()
    );
  }

  putOrder(order: Order, customer: Customer): Observable<Order> {
    let uid = !!order?.Order_Id ? order.Order_Id : this.db.createId();
    return from(this.db.collection(`orders`).doc(uid).set({
      order_id: order.Order_Id,
      customer_id: customer.Customer_Id,
      status: order.Status,
      date_received: order.Date_Received,
      order_rate: order.Order_Rate
    })).pipe(
      map(res => Object.assign(new Order(), {
        Order_Id: uid,
        Customer_Id: customer.Customer_Id,
        Date_Received: order.Date_Received,
        Status: order.Status,
        Order_Rate: order.Order_Rate
      })),
      catchError(err=>throwError(err)),
      shareReplay()
    );
  }
}
