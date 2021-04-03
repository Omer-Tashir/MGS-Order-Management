import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { AuthService } from './auth/auth.service';
import { isAgentGuard, isCustomerGuard, isLoggedInGuard, isManagerGuard, isManagerOrAgentGuard } from './auth/auth.guard';

import { CustomerDetailsComponent } from './customers/customer-details/customer-details.component';
import { ProductsComponent } from './customers/products/products.component';
import { CartComponent } from './cart/cart.component';
import { AgentHomeComponent } from './agents/agent-home/agent-home.component';
import { ParametersComponent } from './parameters/parameters.component';
import { CustomersComponent } from './agents/customers/customers.component';
import { ManagerHomeComponent } from './managers/manager-home/manager-home.component';
import { ReportsComponent } from './managers/reports/reports.component';
import { CustomerHomeComponent } from './customers/customer-home/customer-home.component';
import { CustomerOrdersComponent } from './customers/customer-orders/customer-orders.component';
import { OrdersReportComponent } from './managers/reports/orders-report/orders-report.component';
import { PriorityReportComponent } from './managers/reports/priority-report/priority-report.component';

const routes: Routes = [
  { path: '', redirectTo: '/pre-login', pathMatch: 'full' },
  { path: 'manager-home', component: ManagerHomeComponent, canActivate: [isLoggedInGuard, isManagerGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [isLoggedInGuard, isManagerGuard] },
  { path: 'reports/orders', component: OrdersReportComponent, canActivate: [isLoggedInGuard, isManagerGuard] },
  { path: 'reports/priority', component: PriorityReportComponent, canActivate: [isLoggedInGuard, isManagerGuard] },
  { path: 'agent-home', component: AgentHomeComponent, canActivate: [isLoggedInGuard, isAgentGuard] },
  { path: 'parameters', component: ParametersComponent, canActivate: [isLoggedInGuard, isManagerOrAgentGuard] },
  { path: 'customers', component: CustomersComponent, canActivate: [isLoggedInGuard, isAgentGuard] },
  { path: 'customer-home', component: CustomerHomeComponent, canActivate: [isLoggedInGuard, isCustomerGuard] },
  { path: 'customer/details', component: CustomerDetailsComponent, canActivate: [isLoggedInGuard, isCustomerGuard] },
  { path: 'customer/orders', component: CustomerOrdersComponent, canActivate: [isLoggedInGuard, isCustomerGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [isLoggedInGuard, isCustomerGuard] },
  { path: 'cart', component: CartComponent, canActivate: [isLoggedInGuard, isCustomerGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(private router: Router, private authService: AuthService) {
    this.router.errorHandler = (error: any) => {
      this.authService.logout(error);
    };
  }
}
