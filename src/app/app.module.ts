// Angular Core Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Application modules
import { AppRoutingModule } from './app-routing.module';
import { AuthRoutingModule } from './auth/auth-routing.module';

// Main component
import { AppComponent } from './app.component';

// Angular Material Modules
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './core/custom.mat.paginator.intl';
import { CustomMaterialModule } from './core/material.module';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';

// Shared presentation components and supporting services
import { CartService } from './core/cart.service';
import { DatabaseService } from './core/database.service';
import { PreLoginComponent } from './auth/pre-login/pre-login.component';
import { LoginComponent } from './auth/login/login.component';
import { CustomerHomeComponent } from './customer-home/customer-home.component';
import { ProductsComponent } from './products/products.component';
import { AddToCartDialog } from './products/add-to-cart-dialog/add-to-cart.dialog';
import { CartComponent } from './cart/cart.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { UpdateCustomerDetailsDialog } from './customer-details/update-customer-details-dialog/update-customer-details-dialog';
import { CustomerOrdersComponent } from './customer-orders/customer-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    PreLoginComponent,
    LoginComponent,
    CustomerHomeComponent,
    ProductsComponent,
    AddToCartDialog,
    CartComponent,
    CustomerDetailsComponent,
    UpdateCustomerDetailsDialog,
    CustomerOrdersComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthRoutingModule,
    CustomMaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireDatabaseModule,
  ],
  providers: [
    CartService,
    DatabaseService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
