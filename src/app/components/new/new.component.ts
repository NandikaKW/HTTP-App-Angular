import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';
import { Post, PostService } from '../services/post.service';
import { Subscription } from 'rxjs';

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit, OnDestroy {
  showSuccessMessage = false;
  isLoading = false;
  private subscription: Subscription | null = null;
  private successTimeout: any = null;
  matcher = new CustomErrorStateMatcher();

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
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    // Clear timeout to prevent memory leaks
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }
  }

  async createData() {
  // Prevent multiple submissions
  if (this.form.invalid || this.isLoading) {
    // Mark all fields as touched to show validation errors
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
    return;
  }

  this.isLoading = true;

  const formValue = this.form.value;
  const post: Post = {
    id: Number(formValue.id),
    userId: Number(formValue.userId),
    title: formValue.title || '',
    body: formValue.body || ''
  };

  try {
    await this.postService.createDataFirestore(post);
    
    // Clear any existing timeout to prevent duplicate hiding
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }
    
    // Show single success message
    this.showSuccessMessage = true;
    
    // Reset form
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    
    // Hide success message after 3 seconds
    this.successTimeout = setTimeout(() => {
      this.showSuccessMessage = false;
      this.successTimeout = null;
    }, 3000);
    
    // REMOVED: snackbar code is gone now
    
  } catch (error) {
    console.error('Error creating post', error);
    // REMOVED: error snackbar code is gone now
  } finally {
    this.isLoading = false;
  }
}

  resetForm() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}