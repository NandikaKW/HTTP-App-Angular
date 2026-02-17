import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {


  // Variable to store search input
  searchid: string = '';


  list: any;

  form = new FormGroup({
    id: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{1,5}$/)
    ]),
    userId: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
  });

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { }

  ngOnInit(): void { }

  // Function to update data
  updateData() {
    if (this.form.valid) {
      // Normally updating is PUT, but JSONPlaceholder accepts POST too
      this.http.put<any>(
        'https://jsonplaceholder.typicode.com/posts/' + this.form.get('id')?.value,
        this.form.value
      ).subscribe(data => {
        console.log(data);
        this.list = data;
        this._snackBar.open('Post Updated Successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      });
    }
  }

  // Function to load data by ID
  loadData() {
    // Make GET request to API with the search ID
    this.http
      .get<any[]>('https://jsonplaceholder.typicode.com/posts?id=' + this.searchid)
      .subscribe(response => {
        this.form.patchValue({
          id: response[0].id,
          userId: response[0].userId,
          title: response[0].title,
          body: response[0].body
        });

      });
  }

}
