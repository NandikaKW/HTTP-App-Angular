import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post, PostService } from '../services/post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.scss']
})
export class FindComponent implements OnInit, OnDestroy {
  searchid: string = '';
  list: Post[] = [];
  isLoading = false;
  searchPerformed = false;
  private subscription: Subscription | null = null;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.searchPerformed = false;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadData() {
    const id = this.searchid;

    if (!id) {
      alert('Please enter a valid ID');
      return;
    }

    this.isLoading = true;
    this.searchPerformed = true;

    // Get all posts and find by numeric ID
    this.subscription = this.postService.findAllDataFirestoreWithIds().subscribe(
      posts => {
        // Find the post with matching numeric ID
        const foundPost = posts.find(post => String(post.id) === id);
        
        if (foundPost) {
          this.list = [{
            id: foundPost.id,
            userId: foundPost.userId,
            title: foundPost.title,
            body: foundPost.body
          }];
        } else {
          this.list = [];
        }
        this.isLoading = false;
      },
      error => {
        console.error('Error finding post:', error);
        this.list = [];
        this.isLoading = false;
      }
    );
  }
}