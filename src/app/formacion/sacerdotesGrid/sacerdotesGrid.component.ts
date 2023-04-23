import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
  selector: 'app-sacerdotesGrid',
  templateUrl: './sacerdotesGrid.component.html',
  styleUrls: ['./sacerdotesGrid.component.css']
})

export class SacerdotesGridComponent implements OnInit {
    public tableData1: TableData;
    public tableData2: TableData;
    data: any; // variable para almacenar los datos obtenidos de la llamada
    httpOptions: any;

    constructor(private http: HttpClient,  private router: Router) { 
      this.tableData1 = { headerRow: [], dataRows: [] };
    }
    ngOnInit() {
        let token = localStorage.getItem('jwt');
        console.log(token);

        this.httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          })
        };



        this.http.get('https://encuentro-matrimonial-backend.herokuapp.com/formacion/sacerdote/getAll', this.httpOptions)
        .subscribe(response => {
          console.log(response); // ver los datos obtenidos en la consola
          const responseData = response['response']; // acceder al array 'response' dentro de la respuesta
          this.tableData1.dataRows = responseData.map(item => {
            return {
              id: item.id,
              fechaCreacion:  new Date(item.fechaCreacion).toLocaleDateString('es-ES'),
              jornadaDialogo : item.jornadaDialogo,
              lenguajeAmor: item.lenguajeAmor,
              sacramento: item.sacramento,
              patronesComportamiento: item.patronesComportamiento,  
            }
          });
    
          this.data = responseData;
          });

    }

    editRow(row) {
      const elementId = row.id;
      console.log(elementId);
      this.router.navigate(['/editarSacerdote', elementId]);
      
    }
  }