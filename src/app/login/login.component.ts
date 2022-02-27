import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user_email: string | null = null;
  user_password: string | null = null;

  processing: boolean = false;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,

  ) { }

  ngOnInit(): void {
  }

  doLogin(): void {
    this.processing = true;
    if (this.form.valid) {
      // form is valid from the frontend point of view
      this.authService.login(this.form.value)
        .pipe(catchError(error => {
          Object.keys(error.error).forEach(field => {
            const formControl = this.form.get(field);
            if (formControl) {
              formControl.setErrors({
                serverError: error.error[field]
              });
            }
          });
          this.form.setErrors({
            serverError: error.error['non_field_errors']
          })
          this.processing = false;
          return throwError(error);
        }))
        .subscribe((loginData) => {
          // save the login data to sessionStorage
          // load user information
        }, () => {
        }, () => {
          this.processing = false;
          this.router.navigate(['tasks']);
        })
    } else {
      this.processing = false;
    }
  }

}
