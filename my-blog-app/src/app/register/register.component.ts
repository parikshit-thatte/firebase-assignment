import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authenticationService:AuthenticationService, private _router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(form:NgForm ) {
    this.authenticationService.registerNewUser(form.value.userEmail, form.value.userPassword);
    this._router.navigateByUrl('/login');
  }
}
