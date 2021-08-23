import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { observable, Observable } from 'rxjs';
import firebase from 'firebase';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userData: any;
 
 constructor(private angularFireAuth: AngularFireAuth, private _router: Router) {
  this.userData = angularFireAuth.authState;
 }
 
 /* Sign up */
 registerNewUser(email: string, password: string) {
 this.angularFireAuth.createUserWithEmailAndPassword(email, password)
  .then(res => {
    console.log('You are Successfully signed up!', res);
  })
  .catch(error => {
    console.log('Something is wrong:', error.message);
  });
 }
 
 /* Sign in */
 loginUser(email: string, password: string) {
 this.angularFireAuth.signInWithEmailAndPassword(email, password)
  .then(res => {
    this.userData = res;
  })
  .catch(err => {
    console.log(err.message);
  });
 }
 
 /* Sign out */
 logoutUser() {
  this.angularFireAuth.signOut();
 }
}
