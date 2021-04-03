import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { DatabaseService } from '../../core/database.service';
import { Agent } from '../../models/agent';
import { Customer } from '../../models/customer';
import { UpdateCustomerDetailsDialog } from './update-customer-details-dialog/update-customer-details-dialog';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
  animations: [fadeInOnEnterAnimation()],
})
export class CustomerDetailsComponent {
  customer!: Customer;
  agent!: Agent;

  constructor(private db: DatabaseService, private afAuth: AngularFireAuth, public dialog: MatDialog) { 
    this.afAuth.authState.subscribe(
      (user) => {
        if (user && user != null) {
          this.db.getCustomers().subscribe((customers: any[]) => {
            console.log(customers);
            this.customer = customers.find(c=>c.Customer_Id == user.uid);
            this.db.getAgents().subscribe((agents: any[]) => {
              this.agent = agents.find(a=>a.Agent_Id == this.customer.Agent_Id);
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

  editDetails() {
    const dialogRef = this.dialog.open(UpdateCustomerDetailsDialog, {
      data: {
        customer: this.customer,
        type: 'details'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.customer.Name = result.name;

        this.afAuth.authState.subscribe(
          (user) => {
            if (user && user != null) {
              this.db.putCustomer(this.customer).subscribe(()=>{
                alert('פרטייך עודכנו בהצלחה')
              });
            } 
          },
          (error) => {
            console.log(error);
          }
        ); 
      }
    });
  }

  editRegion() {
    const dialogRef = this.dialog.open(UpdateCustomerDetailsDialog, {
      data: {
        customer: this.customer,
        type: 'region'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.customer.Region = result.region;

        this.afAuth.authState.subscribe(
          (user) => {
            if (user && user != null) {
              this.db.putCustomer(this.customer).subscribe(()=>{
                alert('פרטייך עודכנו בהצלחה')
              });
            } 
          },
          (error) => {
            console.log(error);
          }
        ); 
      }
    });
  }
}
