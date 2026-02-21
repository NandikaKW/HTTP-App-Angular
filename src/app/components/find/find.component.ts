import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post, PostService } from '../services/post.service';

@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.scss']
})
export class FindComponent implements OnInit {
  searchid: string = '';
  list: Post[] = [];
  isLoading = false;
  searchPerformed = false;

  loadData() {
    const id = Number(this.searchid);

    if (!id) {
      alert('Please enter a valid ID');
      return;
    }

    this.isLoading = true;
    this.searchPerformed = true;

    this.postService.find(id).subscribe(
      data => {
        console.log(data);
        this.list = data ? [data] : [];
        this.isLoading = false;
      },
      error => {
        console.error('Post not found', error);
        this.list = [];
        this.isLoading = false;
      }
    );
  }

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.searchPerformed = false;
  }
}
