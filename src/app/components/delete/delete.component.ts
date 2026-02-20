import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  
    list: any[] = [];   
  
    constructor(private http: HttpClient,private _snackBar: MatSnackBar) {}
  
    ngOnInit(): void {
      this.http
        .get<any[]>('https://jsonplaceholder.typicode.com/posts')
        .subscribe(data => {
          console.log(data);
          this.list = data;
        });
    }
     // Function to delete a post by ID with confirm
  delete(id: number) {
    // Show browser confirm dialog
    const confirmed = confirm('Are you sure you want to delete this post?');
    
    if (confirmed) {
      // Send DELETE request
      this.http.delete('https://jsonplaceholder.typicode.com/posts/' + id)
        .subscribe(() => {
          // Remove deleted post from list so table updates immediately
          this.list = this.list.filter(item => item.id !== id);

          // Show success snackbar notification
          this._snackBar.open('Post Deleted Successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        });
    }
  }

    

}
