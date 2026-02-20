import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Post, PostService } from '../services/post.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {


  list: Post[] = [];

  constructor(
    private postService: PostService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.postService.findAll().subscribe(data => {
      console.log(data);
      this.list = data;
    });
  }
  // Function to delete a post by ID with confirm
  delete(id: number) {
    // Show browser confirm dialog
    const confirmed = confirm('Are you sure you want to delete this post?');

    if (confirmed) {
      this.postService.delete(id).subscribe(() => {
        // Remove deleted post from list immediately
        this.list = this.list.filter(item => item.id !== id);

        // Show success notification
        this._snackBar.open('Post Deleted Successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      });
    }
  }
}




