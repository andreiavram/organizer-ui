import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
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
    email: new FormControl(''),
    password: new FormControl('')
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
    // form.classList.add("was-validated");
    if (this.form.valid) {
      this.authService.login(this.form.value)
        .pipe(catchError(error => {
          console.log(error.error);
          Object.keys(error.error).forEach(field => {
            const formControl = this.form.get(field);
            if (formControl) {
              console.log(`assigning ${field} value ${error.error[field]}`);
              formControl.setErrors({
                serverError: error.error[field]
              });
              console.log(formControl.errors);
            }
          });
          this.processing = false;
          return throwError(error);
        }))
        .subscribe(() => {
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
