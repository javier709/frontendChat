import { Component } from '@angular/core';
import { BaseComponent } from '../../shared/base/base.component';
import { ApiService } from '../../services/api.service';
import { ChatService, Message } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { UriConstants } from '../../utils/uris.contants';
import { AuthModel} from '../../models/core/auth.model';
import { SessionStorageConstants } from '../../utils/session.storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent<Message>{

  showTyping = false;
  messages: Message[] = [];
  userData: AuthModel.User;
  inputValue = '';
  counter = 0;

  constructor(
    protected readonly api: ApiService<Message>,
    private readonly chatService: ChatService,
    private readonly auth: AuthService

  ){
    super(api);
    this.userData = this.auth.readFromSession(SessionStorageConstants.USER_TOKEN).user;
    this.getMessages();
    this.chatService.getMessage().subscribe(val => {
      this.messages = val;
    });

    this.chatService.userListening().subscribe(val => {
      if (typeof val === 'boolean') {
        this.showTyping = false;
      } else {
        this.showTyping = this.userData.id !== val.id;
      }
    });
  }

  private async getMessages() {
    this.messages = (await this.searchArrAsync({url: UriConstants.MESSAGES})).response;
  }

  // * Verifico que el usuario escribió algo, luego guardo el mensaje en la base de datos

  saveMessage() {
    if (this.inputValue) {
      const payload = {userId: this.userData.id, content: this.inputValue};
      this.create({url:`${UriConstants.MESSAGES}/create`, data: payload})
      this.inputValue = '';
      this.stopTyping();
    }
  }

  deleteMessage(id:number) {
    this.delete({url:`${UriConstants.MESSAGES}/${id}`});
  }

  startTyping() {
    this.counter ++;
    if (this.counter === 1 ) this.chatService.sendTyping(this.userData);
  }

  stopTyping() {
    this.counter = 0;
    this.chatService.sendTyping(false);
  }
}
