import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BaseComponent } from '../../shared/base/base.component';
import { FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { UriConstants } from 'src/app/utils/uris.contants';
import { AuthService } from '../../services/auth.service';
import { SessionStorageConstants } from '../../utils/session.storage';

type Get = {}
type Post = {
  token: string;
  refresh: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})  
export class LoginComponent extends BaseComponent <Get, Post> {
  constructor(
    protected readonly api:ApiService<Get, Post>,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
    super(api);
    this.formGroup = this.fb.group({      // * Agrupo los controles email y password
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  handleLogin() {
    if(this.isFormValid()) {

      const { email, password} = this.formGroup.value;  // * Una vez que el formulario sea válido, puedo mandar la información al backend
    
      this.createService({url:`${UriConstants.USERS}/login`, data: {email, password}})
      .subscribe({
  
        //* Obtengo la respuesta al subscribe, su es exitosa, me redirijo al login, caso contrario lanzo una alerta de error al usuario
        next: data => {
          const { token, refresh} = data.response ;  // * Recupero el token y el refresh de data.response( va a ser del formulario de login) y lo guardo dentro del sessionStorage
          this.authService.saveToSession(SessionStorageConstants.USER_TOKEN, token);
          this.authService.saveToSession(SessionStorageConstants.USER_REFRESH_TOKEN, refresh);
          this.router.navigate(['']);
        },
        error: error => {
          this.alertConfiguration('ERROR', error);    // * Alerta de severidad de tipo Error, más el mensaje de error
          this.openAlert();
          this.loading = false;
        }
      });
    }      
    
  }
}
