import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  public isUserLoggedIn: boolean = false;

  constructor(public _router: Router) { }

  canActivate(): boolean {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        // ...
        this.isUserLoggedIn = true;
      } else {
        // User is signed out
        // ...
        this.isUserLoggedIn = false;
      }
    });

    return this.isUserLoggedIn;
  }
}
