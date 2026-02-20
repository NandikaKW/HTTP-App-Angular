import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Post, PostService } from '../services/post.service';


@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  list: Post | null = null

  form = new FormGroup({
    id: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{1,5}$/)
    ]),
    userId: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
  });

   constructor(
    private postService: PostService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void { }

  createData() {
      if (this.form.valid) {
    const formValue = this.form.value as { userId: string; title: string; body: string };
    const { userId, title, body } = formValue;
    
    this.postService.create(Number(userId), title, body).subscribe(
        data => {
          console.log(data);
          this.list = data;

          this._snackBar.open('Post Created Successfully!', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            direction: 'ltr'
          });

          this.form.reset(); 
        },
        error => {
          console.error('Error creating post', error);
          this._snackBar.open('Failed to create post!', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000
          });
        }
      );
    }
  }

}
