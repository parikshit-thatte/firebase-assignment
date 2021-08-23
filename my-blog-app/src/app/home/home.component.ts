import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AngularFireStorage } from "@angular/fire/storage";
import { FileUpload } from '../file-upload';
import { finalize, map } from 'rxjs/operators';
import { AngularFireAuth } from "@angular/fire/auth";

export interface Item { title: string; body: string; imgUrl: string; createdBy: string};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  latestCreatedBlogUrl: string = "";
  currentUserId: string = "";
  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  fileUploads: FileUpload[];
  percentage: number;
  private basePath = '/uploads';
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  constructor(private angularFireAuth: AngularFireAuth, private afs: AngularFirestore, private storage: AngularFireStorage, private db: AngularFireDatabase, private authenticationService:AuthenticationService, private _router: Router) {
    this.itemsCollection = afs.collection<Item>('blogs');
    this.items = this.itemsCollection.valueChanges();
  }

  ngOnInit(): void {
    // this.getFiles(6).snapshotChanges().pipe(
    //   map(changes =>
    //     // store the key
    //     changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
    //   )
    // ).subscribe(fileUploads => {
    //   this.fileUploads = fileUploads;
    // });
  }

  selectFile(event): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    const file = this.selectedFiles.item(0);
    this.selectedFiles = undefined;

    this.currentFileUpload = new FileUpload(file);
    this.pushFileToStorage(this.currentFileUpload).subscribe(
      percentage => {
        this.percentage = Math.round(percentage);
      },
      error => {
        console.log(error);
      }
    );
  }

  pushFileToStorage(fileUpload: FileUpload): Observable<number> {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);
  
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          this.saveFileData(fileUpload);
        });
      })
    ).subscribe();
  
    return uploadTask.percentageChanges();
  }


  saveFileData(fileUpload: FileUpload) {
    console.log(fileUpload);
    this.latestCreatedBlogUrl = fileUpload.url;
  }

  
  onSubmit(form:NgForm) {
    const title = form.value.blogTitle;
    const body = form.value.blogBody;
    const imgUrl = this.latestCreatedBlogUrl;

    this.angularFireAuth.authState.subscribe( authState => {
      const createdBy: string = authState.uid;
      const item: Item = { title, body, imgUrl, createdBy};
      this.itemsCollection.add(item);
    });
  }


  logoutUser() {
    this.authenticationService.logoutUser();
    this._router.navigateByUrl('/')
  }

}
