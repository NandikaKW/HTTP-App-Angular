import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) { }

  // Get all posts
  findAll(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  // Get a single post by id
  find(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  // Create a new post
  create(userId: number, title: string, body: string): Observable<Post> {
    const postData = { userId, title, body };
    return this.http.post<Post>(this.apiUrl, postData);
  }

  // Update an existing post
  update(id: number, userId: string, title: string, body: string): Observable<Post> {
    const postData = { id, userId, title, body };
    return this.http.put<Post>(`${this.apiUrl}/${id}`, postData);
  }

  // Delete a post
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
