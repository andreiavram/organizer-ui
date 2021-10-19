import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { TagInputModule } from 'ngx-chips';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TasksComponent } from './tasks/tasks.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { MessagesComponent } from './messages/messages.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { TagColorPipe } from './tag-color.pipe';
import { LoginComponent } from './login/login.component';
import {httpInterceptorProviders} from './http-interceptors';
import {TokenInterceptor} from './http-interceptors/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    TasksComponent,
    MessagesComponent,
    TaskDetailComponent,
    TagColorPipe,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    TagInputModule,
    ReactiveFormsModule,
  ],
  providers: [
    // httpInterceptorProviders
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
