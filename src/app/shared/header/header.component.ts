import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageConstants } from '../../utils/session.storage';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  logo = '../../../assets/logo.png';
  showMenuLogin = true;

  constructor(
    private router: Router,
    private readonly auth:AuthService
  ) {
    this.showMenuLogin = this.auth.readFromSession(SessionStorageConstants.USER_TOKEN).user.id === 0;

  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
