import { Injectable } from '@angular/core';
import { AuthModel } from '../models/core/auth.model';
import jwtDecode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  // * Creo la funcionalidad que me permite almacenar/ manejar los datos de la sesion

  // * Función que guarda los datos en la sesión
  // * Recibe la Key del sessionStorage y el value que es de tipo string, en el storage solo podemos almacenar string
  saveToSession(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }

  readFromSession(key: string): AuthModel.UserTokenData {
    return this.getTokenData(sessionStorage.getItem(key) || '');
  }

  // * Funcion para decodificar el token

  private getTokenData (token: string): AuthModel.UserTokenData {
    return token ? jwtDecode(token): AuthModel.userTokenData   // * verifico que el token existe, si existe llamamos a jwtDecode, caso contrario llamo a AuthModel y la data por default  
  }
}
