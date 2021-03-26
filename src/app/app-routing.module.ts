import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { AuthService } from './auth/auth.service';
import { isCustomerGuard, isLoggedInGuard } from './auth/auth.guard';
import { CustomerHomeComponent } from './customer-home/customer-home.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  { path: '', redirectTo: '/pre-login', pathMatch: 'full' },
  { path: 'customer-home', component: CustomerHomeComponent, canActivate: [isLoggedInGuard, isCustomerGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [isLoggedInGuard, isCustomerGuard] },
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
