import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Post, PostService } from '../services/post.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  searchid: string = '';
  list: Post | null = null;

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

  //Load data by ID
  loadData() {
    const id = Number(this.searchid);

    if (!id) {
      alert('Please enter a valid ID');
      return;
    }

    this.postService.find(id).subscribe(data => {
      this.form.patchValue({
        id:String(data.id),
        userId: String(data.userId),
        title: data.title,
        body: data.body
      });
    });
  }

  // Update data
 updateData() {
  if (this.form.valid) {

    const id = Number(this.form.value.id!);
    const userId = String(this.form.value.userId!); 
    const title = this.form.value.title!;
    const body = this.form.value.body!;

    this.postService.update(id, userId, title, body)
      .subscribe(data => {
        console.log(data);
        this.list = data;

        this._snackBar.open('Post Updated Successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });

        this.form.reset();
      });
  }
}
}


