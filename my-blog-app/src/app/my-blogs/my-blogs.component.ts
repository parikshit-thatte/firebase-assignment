import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

export interface Item { title: string; body: string; imgUrl: string; createdBy: string};

@Component({
  selector: 'app-my-blogs',
  templateUrl: './my-blogs.component.html',
  styleUrls: ['./my-blogs.component.css']
})

export class MyBlogsComponent implements OnInit {

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;

  constructor(private afs: AngularFirestore, private angularFireAuth: AngularFireAuth, private authenticationService:AuthenticationService, private _router: Router) {
    this.angularFireAuth.authState.subscribe( authState => {
      const createdBy: string = authState.uid;
      this.itemsCollection = afs.collection<Item>('blogs', ref => ref.where('createdBy', '==', createdBy));
      this.items = this.itemsCollection.valueChanges();
    });
  }

  ngOnInit(): void {
  }

  logoutUser() {
    this.authenticationService.logoutUser();
    this._router.navigateByUrl('/')
  }

}
