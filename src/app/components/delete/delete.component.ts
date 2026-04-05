// delete.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post, PostService } from '../services/post.service';
import { Subscription } from 'rxjs';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit, OnDestroy {
  list: any[] = [];
  isLoading = true;
  showModal = false;
  selectedDocId: string | null = null;
  selectedPostId: number | null = null;
  showSuccessMessage = false;
  private subscription: Subscription | null = null;
  private successTimeout: any = null;

  constructor(
    private postService: PostService
    ,public loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }
  }

  loadPosts(): void {
    this.isLoading = true;
    this.subscription = this.postService.findAllDataFirestoreWithIds().subscribe({
      next: (data) => {
        this.list = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.list = [];
        this.isLoading = false;
      }
    });
  }

  openDeleteModal(post: any): void {
    this.selectedDocId = post.docId;
    this.selectedPostId = post.id;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedDocId = null;
    this.selectedPostId = null;
  }

  async confirmDelete(): Promise<void> {
    if (this.selectedDocId) {
      try {
        await this.postService.deleteDataFirestore(this.selectedDocId);
        
        this.list = this.list.filter(item => item.docId !== this.selectedDocId);
        this.closeModal();
        
        if (this.successTimeout) {
          clearTimeout(this.successTimeout);
        }
        
        this.showSuccessMessage = true;
        
        this.successTimeout = setTimeout(() => {
          this.showSuccessMessage = false;
          this.successTimeout = null;
        }, 3000);
        
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  }
}