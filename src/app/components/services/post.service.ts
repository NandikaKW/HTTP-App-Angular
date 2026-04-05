import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';  // Add this import
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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

  constructor(private http: HttpClient, private fireStoreService: AngularFirestore) {

  }

  // Get all posts
  findAll(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  // Get a single post by id
  // find(id: number): Observable<Post> {
  //   return this.http.get<Post>(`${this.apiUrl}/${id}`);
  // }

  findAllDataFirestore(): Observable<Post[]> {
    return this.fireStoreService.collection<Post>('post-data').valueChanges();
  }

  // // Create a new post
  // create(userId: number, title: string, body: string): Observable<Post> {
  //   const postData = { userId, title, body };
  //   return this.http.post<Post>(this.apiUrl, postData);
  // }
  
  // Create a new post using Firestore
  createDataFirestore(post: Post): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.fireStoreService.collection('post-data').add(post)
        .then(docRef => {
          console.log('Post added with ID: ', docRef.id);
          resolve();
        })
        .catch(error => {
          console.error('Error adding post: ', error);
          reject(error);
        });
    });
  }

  // Update an existing post
  // update(id: number, userId: string, title: string, body: string): Observable<Post> {
  //   const postData = { id, userId, title, body };
  //   return this.http.put<Post>(`${this.apiUrl}/${id}`, postData);
  // }

 // Add this method to your PostService class
updateDataFirestoreWithId(docId: string, post: Post): Promise<void> {
  if (!docId) {
    return Promise.reject('Document ID is required');
  }
  
  return this.fireStoreService.collection('post-data').doc(docId).update({
    userId: post.userId,
    title: post.title,
    body: post.body
  }).then(() => {
    console.log('Post updated successfully');
  }).catch(error => {
    console.error('Error updating post: ', error);
    throw error;
  });
}

  // // Delete a post
  // delete(id: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${id}`);
  // }

  deleteDataFirestore(id: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.fireStoreService.collection('post-data').doc(id).delete()
        .then(() => {
          console.log('Post deleted successfully');
          resolve();
        })
        .catch(error => {
          console.error('Error deleting post: ', error);
          reject(error);
        });
    });
  }

  find(id: any) {
    return this.fireStoreService.collection<Post>('post-data').doc(id).valueChanges();
  }
  
  // Add this method to get posts with their Firestore document IDs
  findAllDataFirestoreWithIds(): Observable<any[]> {
    return this.fireStoreService.collection('post-data').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Post;
        const docId = a.payload.doc.id;
        return { ...data, docId };
      }))
    );
  }
}
//1:43