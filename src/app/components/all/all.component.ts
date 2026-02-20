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

  constructor(private http: HttpClient,private postService: PostService) {

  }

  ngOnInit(): void {
    this.postService.findAll()
      .subscribe(data => {
        console.log(data);
        this.list = data;
      });
  }
}
