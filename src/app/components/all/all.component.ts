import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post, PostService } from '../services/post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss']
})
export class AllComponent implements OnInit, OnDestroy {
  list: Post[] = [];
  filteredList: Post[] = [];
  isLoading = true;
  sortField: 'id' | 'title' | 'userId' = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  
  // Search
  searchTerm = '';

  // Selected post for detail view
  selectedPost: any = null; // Changed to any to include docId

  // Subscription for Firestore
  private postsSubscription: Subscription | null = null;

  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit(): void {
    this.loadPostsFromFirestore();
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }

  // Load posts from Firestore with document IDs
  loadPostsFromFirestore(): void {
    this.isLoading = true;
    
    // Subscribe to Firestore real-time updates
    this.postsSubscription = this.postService.findAllDataFirestoreWithIds()
      .subscribe({
        next: (postsWithIds) => {
          console.log('Posts from Firestore:', postsWithIds);
          
          // Transform Firestore data to match Post interface
          // Firestore documents might have string IDs, so we need to handle that
          this.list = postsWithIds.map((item: any, index: number) => ({
            id: parseInt(item.id) || index + 1, // Use existing id or generate one
            userId: item.userId,
            title: item.title,
            body: item.body,
            docId: item.docId // Store Firestore document ID for updates/deletes
          }));
          
          this.filteredList = [...this.list];
          this.sortData(this.sortField);
          this.calculatePagination();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading posts from Firestore:', error);
          this.isLoading = false;
          // Fallback to API if needed
          this.loadPostsFromAPI();
        }
      });
  }

  // Fallback method to load from API if Firestore fails
  loadPostsFromAPI(): void {
    this.postService.findAll()
      .subscribe({
        next: (data) => {
          console.log('Posts from API (fallback):', data);
          this.list = data;
          this.filteredList = data;
          this.sortData(this.sortField);
          this.calculatePagination();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading posts from API:', error);
          this.isLoading = false;
        }
      });
  }

  // Get unique user count
  get uniqueUserCount(): number {
    return new Set(this.list.map(post => post.userId)).size;
  }

  // Search functionality
  onSearch(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    this.filteredList = this.list.filter(post => 
      post.title.toLowerCase().includes(this.searchTerm) ||
      post.body.toLowerCase().includes(this.searchTerm) ||
      post.id.toString().includes(this.searchTerm) ||
      post.userId.toString().includes(this.searchTerm)
    );
    this.sortData(this.sortField);
    this.currentPage = 1;
    this.calculatePagination();
  }

  // Refresh posts - reload from Firestore
  refreshPosts(): void {
    this.loadPostsFromFirestore();
    this.searchTerm = '';
    // Clear search input if needed
    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
  }

  // Open post details modal
  openPostDetails(post: any): void {
    this.selectedPost = post;
    document.body.style.overflow = 'hidden';
  }

  // Close post details modal
  closePostDetails(): void {
    this.selectedPost = null;
    document.body.style.overflow = 'auto';
  }

  // Pagination methods
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredList.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Get paginated data
  get paginatedList(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  sortData(field: 'id' | 'title' | 'userId'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.filteredList.sort((a, b) => {
      let valueA: any = a[field];
      let valueB: any = b[field];

      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.currentPage = 1;
  }
}