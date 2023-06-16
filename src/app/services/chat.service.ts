import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { AuthModel } from '../models/core/auth.model';


export type Message = {
  id: number,
  userId: number,
  content: string,
  date: string,
  firstName: string,
  lastName: string
}


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(

    private readonly socket: Socket


  ) { }

  // * Emitimos un evento de socket, cuando el usuario está tipeando, todos los usuarios pueden escuchar este evento
  sendTyping(msg: AuthModel.User | false){
    this.socket.emit('typing', msg);
  }

  // * Obtenemos los mensajes escuchando el evento "messages", que definimos en el backend en nuestro controlador "messages"

  getMessage() {
    return this.socket.fromEvent<Message[]>('messages').pipe(map((data) => data));  // * Me devuelve el contenido del mensaje, como lo estructuramos con el type
  }

  // * Evento que me devuelve los datos del usuario o un booleano, con ello un usuario puede escuchar cuando otro/s usuario/s está/n tipeando
  userListening() {
    return this.socket.fromEvent<AuthModel.User | false>('listening').pipe(map((data) => data));  // * Me devuelve el contenido del mensaje, como lo estructuramos con el type
  }


}
