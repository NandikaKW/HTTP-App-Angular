import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  form =new FormGroup({
    id: new FormControl('',Validators.required),
    userId: new FormControl('',Validators.required),
    title: new FormControl('',Validators.required),
    body: new FormControl('',Validators.required),
  });
  createData(){
    console.log(this.form);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
