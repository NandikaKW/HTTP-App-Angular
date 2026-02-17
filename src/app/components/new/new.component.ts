import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

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

  createData() {

    if (this.form.valid) {

      this.http.post<any>(
        'https://jsonplaceholder.typicode.com/posts',
        this.form.value
      )
        .subscribe(data => {
          console.log(data);
          this.list = data;

          this._snackBar.open('Post Created Successfully!', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            direction: 'ltr'
          });
        });

    }
  }

}
