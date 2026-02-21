import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post, PostService } from '../services/post.service';


@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss']
})
export class AllComponent implements OnInit {
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
  selectedPost: Post | null = null;

  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.isLoading = true;
    this.postService.findAll()
      .subscribe(data => {
        console.log(data);
        this.list = data;
        this.filteredList = data;
        this.sortData(this.sortField); // Apply default sorting
        this.calculatePagination();
        this.isLoading = false;
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
    this.sortData(this.sortField); // Re-apply sorting after search
    this.currentPage = 1;
    this.calculatePagination();
  }

  // Refresh posts
  refreshPosts(): void {
    this.loadPosts();
    this.searchTerm = '';
    // Clear search input if needed
    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
  }

  // Open post details modal
  openPostDetails(post: Post): void {
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
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  // Get paginated data
  get paginatedList(): Post[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  sortData(field: 'id' | 'title' | 'userId'): void {
    if (this.sortField === field) {
      // Toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.filteredList.sort((a, b) => {
      let valueA: any = a[field];
      let valueB: any = b[field];

      // Handle string comparison
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
