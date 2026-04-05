// update.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Post, PostService } from '../services/post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit, OnDestroy {
  searchid: string = '';
  list: Post | null = null;
  showSuccessMessage = false;
  showErrorMessage = false;
  errorTitle = '';
  errorMessage = '';
  isLoading = false;
  searchPerformed = false;
  private successTimeout: any = null;
  private errorTimeout: any = null;
  private docId: string | null = null;
  private subscription: Subscription | null = null;

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
    private postService: PostService
  ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  }

  loadData() {
    const id = this.searchid;

    if (!id) {
      this.showError('Invalid Input', 'Please enter a valid post ID');
      return;
    }

    this.isLoading = true;
    this.searchPerformed = true;

    this.subscription = this.postService.findAllDataFirestoreWithIds().subscribe(
      posts => {
        const foundPost = posts.find(post => String(post.id) === id);
        
        if (foundPost) {
          this.docId = foundPost.docId;
          this.form.patchValue({
            id: String(foundPost.id),
            userId: String(foundPost.userId),
            title: foundPost.title,
            body: foundPost.body
          });
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.form.reset();
          this.docId = null;
          this.showError('Post Not Found', `No post found with ID "${id}"`);
        }
      },
      error => {
        console.error('Error finding post:', error);
        this.isLoading = false;
        this.showError('Search Failed', 'Unable to search for the post. Please try again.');
      }
    );
  }

  async updateData() {
    if (this.form.valid && this.docId) {
      const post: Post = {
        id: Number(this.form.value.id!),
        userId: Number(this.form.value.userId!),
        title: this.form.value.title!,
        body: this.form.value.body!
      };

      try {
        await this.postService.updateDataFirestoreWithId(this.docId, post);
        
        if (this.successTimeout) {
          clearTimeout(this.successTimeout);
        }
        
        this.showSuccessMessage = true;
        this.resetForm();
        
        this.successTimeout = setTimeout(() => {
          this.showSuccessMessage = false;
          this.successTimeout = null;
        }, 3000);
        
      } catch (error) {
        console.error('Error updating post:', error);
        this.showError('Update Failed', 'Failed to update the post. Please try again.');
      }
    } else {
      this.showError('Cannot Update', 'Please search for a valid post first');
    }
  }

  showError(title: string, message: string) {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
    
    this.errorTitle = title;
    this.errorMessage = message;
    this.showErrorMessage = true;
    
    this.errorTimeout = setTimeout(() => {
      this.showErrorMessage = false;
      this.errorTimeout = null;
    }, 4000);
  }

  closeError() {
    this.showErrorMessage = false;
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = null;
    }
  }

  resetForm(): void {
    this.form.reset();
    this.searchid = '';
    this.docId = null;
    this.searchPerformed = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  resetSearch(): void {
    this.searchid = '';
    this.searchPerformed = false;
    this.form.reset();
    this.docId = null;
  }
}