import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import * as ExcelJS from 'exceljs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDownloadDialogComponent } from 'app/shared/confirm-download-dialog/confirm-download-dialog.component'; 
import { ConfirmDeleteComponent } from 'app/shared/confirm-delete/confirm-delete.component';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}


@Component({
  selector: 'app-primerPilarGrid',
  templateUrl: './primerPilarGrid.component.html',
  styleUrls: ['./primerPilarGrid.component.css'],
})

export class PrimerPilarGridComponent implements OnInit {
    public tableData1: TableData;
    public tableData2: TableData;
    data: any; // variable para almacenar los datos obtenidos de la llamada
    @ViewChild('row') row: any;
    httpOptions: any;
    token: any;
    response: any;

    currentPage = 1;
    pageSize = 5; // Tamaño de página deseado
    totalRecords = 20; // Número total de registros

    // Calcula el número total de páginas
    totalPages = Math.ceil(this.totalRecords / this.pageSize);

    // Genera el array de páginas
    pages = Array(this.totalPages).fill(0).map((x, i) => i + 1);


    constructor(private http: HttpClient,  private router: Router, public dialog: MatDialog) { 
        this.tableData1 = { headerRow: [], dataRows: [] };
        this.tableData2 = { headerRow: [], dataRows: [] };

    }

  ngOnInit() {
    let token = localStorage.getItem('jwt');
    let userId = localStorage.getItem('userId');

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    this.http.get(`https://encuentro-matrimonial-backend.herokuapp.com/pilar/primerPilar/getAll?id=${userId}`, this.httpOptions)
    .subscribe(response => {
      console.log(response); // ver los datos obtenidos en la consola
      const responseData = response['response']; // acceder al array 'response' dentro de la respuesta
      this.tableData1.dataRows = responseData.slice(0, 5).map(item => {
          return { 
          id: item.id,
          numFDS : item.numFDS,
          numMatrinoniosVivieron : item.numMatrinoniosVivieron,
          fechaCreacion: new Date(new Date(item.fechaCreacion).getTime() + 86400000).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').join('-'),
          numSacerdotesVivieron: item.numSacerdotesVivieron,
          numReligiososVivieron: item.numReligiososVivieron,
                
        }
      });   

      const responseData2 = response['totalResponse']; // acceder al array 'response' dentro de la respuesta
      this.tableData2.dataRows = responseData2.slice(0, 5).map(item => {
          return { 
          key: item.key,
          value : item.value,                
        }
        
      });  
         
      this.data = responseData;
      // Calcular el número total de páginas
      this.totalPages = Math.ceil(this.data.length / this.pageSize);

      // Generar un array con las páginas
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

      // Actualizar los datos de la página actual
      this.setCurrentPage(1);
    });
    
   
  }
  setCurrentPage(page: number) {
    this.currentPage = page;
    const start = (page - 1) * 5;
    const end = start + 5;
    this.tableData1.dataRows = this.data.slice(start, end).map(item => {
      return {
        id: item.id,
        numFDS : item.numFDS,
        numMatrinoniosVivieron : item.numMatrinoniosVivieron,
        fechaCreacion: new Date(new Date(item.fechaCreacion).getTime() + 86400000).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'}).split('/').join('-'),
        numSacerdotesVivieron: item.numSacerdotesVivieron,
        numReligiososVivieron: item.numReligiososVivieron        
      }
    });
  }
  calculatePageData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.tableData1.dataRows = this.data.slice(start, end);
  }

  openDialogDelete(row):void{
    const dialogRef = this.dialog.open(ConfirmDeleteComponent,{
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if(res){
        this.deleteRow(row);
      }
    })
  }
  public deleteRow(row) {
    const params = { id: row.id };
    console.log(this.httpOptions);
    const token = localStorage.getItem('jwt');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const response = this.http.post(`https://encuentro-matrimonial-backend.herokuapp.com/pilar/primerPilar/delete?id=${params.id}`, {}, httpOptions);
    
    response.subscribe((result: any) => {
      // Actualizar la tabla llamando la función getTableData()
      this.getTableData();
      this.getTableData2();
      this.setCurrentPage(1);
    });
  }


  editRow(row) {
    const elementId = row.id;
    console.log(elementId);
    this.router.navigate(['/editarPrimerPilar', elementId]);
    
  }

  public getTableData() {
    let userId = localStorage.getItem('userId');
    this.http.get(`https://encuentro-matrimonial-backend.herokuapp.com/pilar/primerPilar/getAll?id=${userId}`, this.httpOptions)
      .subscribe(response => {
        console.log(response); // ver los datos obtenidos en la consola
        const responseData = response['response']; // acceder al array 'response' dentro de la respuesta
        this.tableData1.dataRows = responseData.map(item => {
          return {
            id: item.id,
            numFDS : item.numFDS,
            numMatrinoniosVivieron : item.numMatrinoniosVivieron,
            fechaCreacion: new Date(new Date(item.fechaCreacion).getTime() + 86400000).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'}).split('/').join('-'),
            numSacerdotesVivieron: item.numSacerdotesVivieron,
            numReligiososVivieron: item.numReligiososVivieron        
          }
        });
  
        this.data = responseData;
      });
  }

  public getTableData2() {
    let userId = localStorage.getItem('userId');
    this.http.get(`https://encuentro-matrimonial-backend.herokuapp.com/pilar/primerPilar/getAll?id=${userId}`, this.httpOptions)
      .subscribe(response => {
        console.log(response); // ver los datos obtenidos en la consola
        const responseData = response['totalResponse']; // acceder al array 'response' dentro de la respuesta
        this.tableData2.dataRows = responseData.map(item => {
          return {
            key: item.key,
            value : item.value,
          }
        });
  
        this.data = responseData;
      });
  }
  
  openDialog():void{
    const dialogRef = this.dialog.open(ConfirmDownloadDialogComponent,{
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if(res){
        this.generateExcel();
      }
    })
  }
 


  generateExcel() {
    let userId = localStorage.getItem('userId');
    let year = 2022;
  
    // Realizar la consulta y obtener los datos en un arreglo
    this.http.get(`https://encuentro-matrimonial-backend.herokuapp.com/pilar/primerPilar/getAll?id=${userId}&year=${year}`, this.httpOptions)
      .subscribe(data => {
        const headers = ['ID', 'Fecha de Creación', 'Num. FDS', 'Num. Matrimonios Vivieron', 'Num. Sacerdotes Vivieron', 'Num. Religiosos/as Vivieron'];
  
        const responseData = data['response']; // acceder al array 'response' dentro de la respuesta
        const responseData2 = data['totalResponse']; // acceder al array 'response' dentro de la respuesta
  
        // Crear un nuevo libro de Excel
        const workbook = new ExcelJS.Workbook();
  
        // Agregar una nueva hoja de cálculo
        const worksheet = workbook.addWorksheet('Sheet1');
  
        // Fusionar celdas para el título "Primer Pilar"
        worksheet.mergeCells('A1:A6');
  
        // Agregar el título "Primer Pilar" en la celda combinada
        const titleCell = worksheet.getCell('A1');
        titleCell.value = 'Primer Pilar';
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  
        // Agregar los encabezados como primera fila
        const headerRow = worksheet.addRow(headers);
  
        // Obtener los datos en forma de matriz
        const dataMatrix = responseData.map(item => [
          item.id,
          new Date(item.fechaCreacion).toLocaleDateString('es-ES'),
          item.numFDS,
          item.numMatrinoniosVivieron,
          item.numSacerdotesVivieron,
          item.numReligiososVivieron
        ]);
  
        const dataMatrix2 = responseData2.map(item => [item.key, item.value]);
  
        // Transponer la matriz para cambiar la orientación de los datos
        const transposedData = this.transpose(dataMatrix);
        const transposedData2 = this.transpose(dataMatrix2);
  
        // Agregar los datos transpuestos en filas
        transposedData.forEach((row, rowIndex) => {
          const rowData = worksheet.addRow(row);
          rowData.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
        });
  
        transposedData2.forEach((row, rowIndex) => {
          const rowData = worksheet.addRow(row);
          rowData.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
        });
  
        // Convertir el libro de Excel a un archivo binario y descargarlo
        workbook.xlsx.writeBuffer().then(buffer => {
          const blob = new Blob([buffer], { type: 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'Primer Pilar.xlsx';
          link.click();
        });
      });
  }
  
  // Función para transponer una matriz
  transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
  }
  
  
  

  

  

  // Función para convertir una cadena a un arreglo de bytes
  s2ab(s: string) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }
  filterByDate(selectedDate: string) {
    const selectedDateObj = new Date(selectedDate);
    const selectedYear = selectedDateObj.getFullYear();
    const selectedMonth = selectedDateObj.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const selectedDay = selectedDateObj.getDate();
  
    const filteredData = this.data.filter(item => {
      const itemDate = new Date(item.fechaCreacion);
      const itemYear = itemDate.getFullYear();
      const itemMonth = itemDate.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
      const itemDay = itemDate.getDate();
  
      return itemYear === selectedYear && itemMonth === selectedMonth && itemDay === selectedDay;
    });
  
    this.totalPages = Math.ceil(filteredData.length / this.pageSize); // Actualizar el número total de páginas
  
    // Verificar si la página actual es mayor al nuevo número total de páginas y ajustarla si es necesario
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
  
    this.tableData1.dataRows = filteredData.slice(start, end).map(item => {
      const fechaCreacion = new Date(item.fechaCreacion);
      fechaCreacion.setDate(fechaCreacion.getDate() + 1);
  
      return {
        id: item.id,
        numFDS: item.numFDS,
        numMatrinoniosVivieron: item.numMatrinoniosVivieron,
        fechaCreacion: fechaCreacion
          .toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
          .split('/')
          .join('-'),
        numSacerdotesVivieron: item.numSacerdotesVivieron,
        numReligiososVivieron: item.numReligiososVivieron,
        isVisible: true
      };
    });
  }
  
}