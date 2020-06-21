import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../_models/User';
import { AuthService } from 'src/app/_services/Auth.service';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-Registration',
  templateUrl: './Registration.component.html',
  styleUrls: ['./Registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  user: User;

  constructor(public formBuilder: FormBuilder,
              private toastService: ToastrService,
              private authService: AuthService,
              public route: Router) { }

  ngOnInit() {
    this.validation();
  }

  validation() {
    this.registerForm = this.formBuilder.group({
      fullName : ['', Validators.required],
      email : ['', [Validators.required, Validators.email]],
      userName : ['', Validators.required],
      passwords : this.formBuilder.group({
        password : ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword : ['', Validators.required]
      }, { validator: this.compararSenhas })
    });
  }

  compararSenhas(fb: FormGroup){
    const confirmaSenhaCtrl = fb.get('confirmPassword');
    if (confirmaSenhaCtrl.errors == null || 'mismatch' in confirmaSenhaCtrl.errors){
      if (fb.get('password').value !== confirmaSenhaCtrl.value){
        confirmaSenhaCtrl.setErrors({mismatch : true});
      } else {
        confirmaSenhaCtrl.setErrors(null);
      }
    }
  }

  cadastrarUsuario() {
    if (this.registerForm.valid) {
      this.user = Object.assign({
        password: this.registerForm.get('passwords.password').value,
        fullName: this.registerForm.get('fullName').value,
        email: this.registerForm.get('email').value,
        userName: this.registerForm.get('userName').value
      });
      this.authService.register(this.user)
        .subscribe(
          () => {
            this.toastService.success('Cadastro realizado!');
            this.route.navigate(['User/Login']);
          }, error => {
            const errors = error.error;
            errors.forEach(element => {
              switch (element.code) {
                case 'DuplicateUserName':
                  this.toastService.error('Já existi um usuário cadastro com esse mesmo nome!');
                  break;
                default:
                  this.toastService.error(`Ocorre um erro ao tentar cadastrar, Code:${element.code}`);
                  break;
              }
            });
          }
        );
    }
  }
}
