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
import { Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Agent } from 'src/app/models/agent';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  
  customers$!: Observable<Customer[]>;

  agent!: Agent | any;
  displayedColumns: string[] = ['Customer_Id', 'Name', 'Phone_Num', 'Email', 'Region', 'Type', 'Discount', 'Quality_Rate', 'Obligo_Rate', 'Seniority_Rate'];
  dataSource!: MatTableDataSource<Customer>;
  isLoadingData: boolean = true;

  constructor(private afAuth: AngularFireAuth, private db: DatabaseService, 
    private cartService: CartService, private router: Router) {}

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a: Customer, b: Customer) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Customer_Id': return this.compare(a.Customer_Id, b.Customer_Id, isAsc);
        case 'Name': return this.compare(a.Name, b.Name, isAsc);
        case 'Phone_Num': return this.compare(a.Phone_Num, b.Phone_Num, isAsc);
        case 'Email': return this.compare(a.Email, b.Email, isAsc);
        case 'Region': return this.compare(a.Region, b.Region, isAsc);
        case 'Type': return this.compare(a.Type, b.Type, isAsc);
        case 'Discount': return this.compare(a.Discount, b.Discount, isAsc);
        case 'Quality_Rate': return this.compare(a.Quality_Rate, b.Quality_Rate, isAsc);
        case 'Obligo_Rate': return this.compare(a.Obligo_Rate, b.Obligo_Rate, isAsc);
        case 'Seniority_Rate': return this.compare(a.Seniority_Rate, b.Seniority_Rate, isAsc);
        default: return 0;
      }
    });
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  uidTrack(index: any, customer: Customer) {
    return customer.Customer_Id;
  }

  ngOnInit(): void {
    this.customers$ = this.db.getCustomers();

    this.afAuth.authState.subscribe(
      (user) => {
        if (user && user != null) {
          this.db.getAgents().subscribe((agents: any[]) => {
            this.agent = agents.find(a=>a.Agent_Id == user.uid);
            this.customers$.pipe(
              map(c=>c.filter(cu=>cu.Agent_Id == this.agent.Agent_Id))
            )
            .subscribe(data => {
              console.log(data);
              this.dataSource = new MatTableDataSource(data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.sortData({ active: 'Name', direction: 'desc' });
        
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
}