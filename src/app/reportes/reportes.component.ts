import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  httpOptions: any;
  token: any;
  response: any;

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    let token = localStorage.getItem('jwt');
    let userId = localStorage.getItem('userId');

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    }
  }

}
