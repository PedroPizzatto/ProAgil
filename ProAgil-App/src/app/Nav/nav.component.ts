import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/Auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private route: Router,
    public authService: AuthService) {}

  ngOnInit() {}

  loggedIn() {
    return this.authService.loggedIn();
  }

  entrar() {
    this.route.navigate(['/User/Login']);
  }

  // getUserName() {
  //   return sessionStorage.getItem('username');
  // }

  logout() {
    localStorage.removeItem('token');
    this.route.navigate(['/User/Login']);
  }

  // isLogginPage() {
  //   return this.route.url === '/User/Login';
  // }

}
