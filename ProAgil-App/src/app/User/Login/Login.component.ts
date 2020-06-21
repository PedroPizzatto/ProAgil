import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/Auth.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css']
})
export class LoginComponent implements OnInit {

  titulo = 'Login';
  model: any = {};

  constructor(public router: Router,
              public authService: AuthService,
              public toastrService: ToastrService) { }

  ngOnInit() {
    if (localStorage.getItem('token') !== null) {
      this.router.navigate(['/Dashboard']);
    }
  }

  public login() {
    this.authService.login(this.model)
      .subscribe(
        () => {
          this.router.navigate(['/Dashboard']);
        },
        error => {
          // if (error.status === 404) {
          //   this.toastrService.error(error.error);
          // } else {
            this.toastrService.error('Ocorre uma falha ao tentar efetuar o login!');
          // }
        }
      );
  }

}
