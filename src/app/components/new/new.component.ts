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
  list: Post | null = null;
  showSuccessMessage = false; // Beautiful popup message

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

          // Show the beautiful success popup
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 5000);

          this.form.reset();
        },
        error => {
          console.error('Error creating post', error);
          // Keep only error snackbar (or remove if you want consistent UI)
          this._snackBar.open('Failed to create post!', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      );
    }
  }

  // UI helper method
  resetForm() {
    this.form.reset();
  }
}
