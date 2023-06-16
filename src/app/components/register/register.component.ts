import { Component } from '@angular/core';
import { BaseComponent } from '../../shared/base/base.component';
import { ApiService } from '../../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UriConstants } from '../../utils/uris.contants';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})

 // * Extiendo de Base component para acceder a sus funciones y propiedades.

export class RegisterComponent extends BaseComponent {

  // * Inicializo la variable userImg, de tipo File y nula

  userImg: File | null = null;

  constructor( 
    protected readonly api: ApiService, 
    protected readonly fb: FormBuilder,   // * Inyecto dependecia readonly fb, que es una instancia de FormBuilder
    protected readonly router: Router) {   // * Inyecto router para manejar redireccionamientos en la página

    super(api);         // * Como extiendo de una clase padre tengo que llamar a super y pasar un argumento

    this.formGroup = this.fb.group({               // * Llamo al componente formGroup, que está en BaseComponent, que va a ser igual a fb, y agrupo los controllers que necesito y los defino acá.

      firstName: ['', Validators.required],
      lastName: [''],
      email: ['',Validators.required],
      password: ['',Validators.required],
    });      
  }

  // * Upload para imagenes que selecciona el usuario como foto de perfil

  onUpload({ files }: { files: FileList}) {
    this.userImg = files[0];                // * Accedo a la posición 0 de la carga de imágenes, ya que quiero seleccionar solo una, y se la asigno a iserimg
  }

  // * Eliminamos la imagen seleccionada

  removeFile() {
    this.userImg = null;
  }

  // * Función para obtener los controles con los valores del formulario de registro

  handleRegister() {
   // * Si el formulario es válido, hace todo lo demás
    if (this.isFormValid()){

           // * Creo un nuevo formData y envío los campos que espera el backend, los obtengo de this.formGoup.value
    
    this.loading = true;
    const formData = new FormData();
    const { firstName, lastName, email, password } = this.formGroup.value;

    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('active','1');
    formData.append('roleId', '2');

    // * Si tengo información en la carga de la imagen, paso la imagen al backend
    // * Append va a ser de tipo img y su valor, va a ser this.userImg

    if (this.userImg) formData.append('img', this.userImg);

    // * Una vez que tengo toda la información que voy a enviar, llamo a createService, que está en Base component
    // * Esto me duvuelve un observable al que tengo que suscribirme, enviando el form data a la url

    this.createService({url: `${UriConstants.USERS}/create`, data: formData})
    .subscribe({

      //* Obtengo la respuesta al subscribe, su es exitosa, me redirijo al login, caso contrario lanzo una alerta de error al usuario
      next: () => {
        this.router.navigate(['/login']);
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
