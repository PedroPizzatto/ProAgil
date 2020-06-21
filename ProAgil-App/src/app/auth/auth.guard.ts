import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  // wtHelper = new JwtHelperService();
  constructor(private routes: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token =  localStorage.getItem('token');
    // if ((token !== null) && (!this.jwtHelper.isTokenExpired(token))) {
    if (localStorage.getItem('token') !== null) {
      return true;
    } else {
      this.routes.navigate(['/User/Login']);
      return false;
    }
  }
}
