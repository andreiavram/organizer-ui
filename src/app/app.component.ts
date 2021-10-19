import { Component } from '@angular/core';
import {AuthService} from './auth.service';
import {User} from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'organizer-ui';

  constructor(private authService: AuthService) {
  }

  ngOnInit():void {
    this.authService.getCurrentUser().subscribe();
  }

  userAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  currentUser(): User | null   {
    return this.authService.currentUser;
  }
}
