import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {TagInputModule} from 'ngx-chips';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TaskListComponent} from './tasks/task-list/task-list.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MessagesComponent} from './messages/messages.component';
import {TaskDetailComponent} from './tasks/task-detail/task-detail.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {TagColorPipe} from './tags/tag-color.pipe';
import {LoginComponent} from './login/login.component';
import {TokenInterceptor} from './http-interceptors/token.interceptor';
import {TagListComponent} from './tags/tags-list/tag-list.component';
import {TagDetailComponent} from './tags/tag-detail/tag-detail.component';
import {ColorPickerModule} from 'ngx-color-picker';
import { ReverseLuminanceColorPipe } from './reverse-luminance-color.pipe';
import { SlugifyPipe } from './slugify.pipe';
import { ProjectListComponent } from './projects/project-list/project-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    MessagesComponent,
    TaskDetailComponent,
    TagColorPipe,
    LoginComponent,
    TagListComponent,
    TagDetailComponent,
    ReverseLuminanceColorPipe,
    SlugifyPipe,
    ProjectListComponent,
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
    ColorPickerModule
  ],
  providers: [
    // httpInterceptorProviders
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
