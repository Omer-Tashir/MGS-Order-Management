import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PreLoginComponent } from './pre-login/pre-login.component';

const routes: Routes = [
  { path: 'pre-login', component: PreLoginComponent },
  { path: 'login/:type', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
