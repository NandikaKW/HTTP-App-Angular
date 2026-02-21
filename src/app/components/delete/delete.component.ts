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
  isLoading = true;
  showModal = false;
  selectedPostId: number | null = null;

  constructor(
    private postService: PostService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.isLoading = true;
    this.postService.findAll().subscribe(data => {
      this.list = data;
      this.isLoading = false;
    });
  }

  openDeleteModal(id: number): void {
    this.selectedPostId = id;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPostId = null;
  }

  confirmDelete(): void {
    if (this.selectedPostId) {
      this.postService.delete(this.selectedPostId).subscribe(() => {
        this.list = this.list.filter(item => item.id !== this.selectedPostId);
        this.closeModal();
        
        this._snackBar.open('✓ Post deleted successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['custom-success-snackbar']
        });
      });
    }
  }
}




