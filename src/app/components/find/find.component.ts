import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.scss']
})
export class FindComponent implements OnInit {
  searchid: string = '';
  list: any[] = [];
 
 loadData() {
    this.http
      .get<any[]>('https://jsonplaceholder.typicode.com/posts?id=' + this.searchid)
      .subscribe(data => {
        console.log(data);
        this.list = data;
      });
  }
  


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
     
  }

}
