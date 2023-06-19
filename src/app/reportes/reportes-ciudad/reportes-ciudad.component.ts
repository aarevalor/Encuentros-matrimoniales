import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import * as ExcelJS from 'exceljs';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';


declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}



@Component({
  selector: 'app-reportes-ciudad',
  templateUrl: './reportes-ciudad.component.html',
  styleUrls: ['./reportes-ciudad.component.scss']
  
})
export class ReportesCiudadComponent {

  public tableData1: TableData;
  public tableData2: TableData;
    data: any; // variable para almacenar los datos obtenidos de la llamada
    @ViewChild('row') row: any;
    httpOptions: any;
    token: any;
    response: any;
    selectedYear: number;
    selectedCity: any;

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

 


// Función para transponer una matriz
transpose(matrix) {
  return matrix[0].map((col, i) => matrix.map(row => row[i]));
}


// Generar Excel
// Generar Excel
generateExcel() {
  let userId = localStorage.getItem('userId');
  const selectedYear = this.selectedYear;
  const selectedCity = this.selectedCity; // Nueva variable para almacenar la ciudad seleccionada

  // Realizar la consulta y obtener los datos en un arreglo para cada pilar
  const pilar1Data$ = this.http.get(`https://encuentro-matrimonial-backend.herokuapp.com/pilar/primerPilar/getAll?id=${userId}`, this.httpOptions);
  const pilar2Data$ = this.http.get(`https://encuentro-matrimonial-backend.herokuapp.com/pilar/segundoPilar/getAll?id=${userId}`, this.httpOptions);
  const pilar3Data$ = this.http.get(`https://encuentro-matrimonial-backend.herokuapp.com/pilar/tercerPilar/getAll?id=${userId}`, this.httpOptions);
  const pilar4Data$ = this.http.get(`https://encuentro-matrimonial-backend.herokuapp.com/pilar/cuartoPilar/getAll?id=${userId}`, this.httpOptions);

  // Combinar las consultas en un solo Observable
  forkJoin([pilar1Data$, pilar2Data$, pilar3Data$, pilar4Data$]).subscribe(data => {
    const headers = ['ID', 'Fecha de Creación', 'Num. FDS', 'Num. Matrimonios Vivieron', 'Num. Sacerdotes Vivieron', 'Num. Religiosos/as Vivieron'];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    let currentRow = 1;

    // Agregar los datos del pilar 1
    const pilar1Data = data[0]['response'];
    if (pilar1Data.length > 0) {
      // Fusionar celdas para el título "Primer Pilar"
      worksheet.mergeCells(`A${currentRow}:F${currentRow}`);
      const titleCell = worksheet.getCell(`A${currentRow}`);
      titleCell.value = 'Primer Pilar';
      titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
      currentRow++;

      // Agregar los encabezados como fila
      worksheet.addRow(headers);

      pilar1Data.forEach(item => {
        const itemYear = new Date(item.fechaCreacion).getFullYear();
        const itemCity = item.ciudad; // Nueva variable para almacenar la ciudad de cada registro
        if (itemYear === selectedYear && itemCity === selectedCity) { // Aplicar el filtro de año y ciudad
          worksheet.addRow([
            item.id,
            new Date(item.fechaCreacion).toLocaleDateString('es-ES'),
            item.numFDS,
            item.numMatrinoniosVivieron,
            item.numSacerdotesVivieron,
            item.numReligiososVivieron
          ]);
        }
      });

      currentRow += pilar1Data.length + 1;
    }

    // Agregar los datos del pilar 2
    const pilar2Data = data[1]['response'];
    if (pilar2Data.length > 0) {
      // Fusionar celdas para el título "Segundo Pilar"
      worksheet.mergeCells(`A${currentRow}:K${currentRow}`);
      const titleCell = worksheet.getCell(`A${currentRow}`);
      titleCell.value = 'Segundo Pilar';
      titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
      currentRow++;

      // Agregar los encabezados como fila
      worksheet.addRow(headers);

      pilar2Data.forEach(item => {
        const itemYear = new Date(item.fechaCreacion).getFullYear();
        const itemCity = item.ciudad; // Nueva variable para almacenar la ciudad de cada registro
        if (itemYear === selectedYear && itemCity === selectedCity) { // Aplicar el filtro de año y ciudad
          worksheet.addRow([
            item.id,
            new Date(item.fechaCreacion).toLocaleDateString('es-ES'),
            item.numMatrimosServidoresActivos,
            item.numSacerdotesServidoresActivos,
            item.numMatrimosServidoresProfundoActivos,
            item.numSacerdotesServidoresprofundoActivos,
            item.numFdsProfundosPeriodo,
            item.numMatrimosVivieronProfundo,
            item.numSacerdotesVivieronProfundo,
            item.numMatrimosDebutaronProfundo,
            item.numSacerdotesDebutaronProfundo,
          ]);
        }
      });

      currentRow += pilar2Data.length + 1;
    }

    // Agregar los datos del pilar 3
    const pilar3Data = data[2]['response'];
    if (pilar3Data.length > 0) {
      // Fusionar celdas para el título "Tercer Pilar"
      worksheet.mergeCells(`A${currentRow}:G${currentRow}`);
      const titleCell = worksheet.getCell(`A${currentRow}`);
      titleCell.value = 'Tercer Pilar';
      titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
      currentRow++;

      // Agregar los encabezados como fila
      worksheet.addRow(headers.slice(0, 7));

      pilar3Data.forEach(item => {
        const itemYear = new Date(item.fechaCreacion).getFullYear();
        const itemCity = item.ciudad; // Nueva variable para almacenar la ciudad de cada registro
        if (itemYear === selectedYear && itemCity === selectedCity) { // Aplicar el filtro de año y ciudad
          worksheet.addRow([
            item.id,
            item.numDiocesisContacto,
            item.numDiocesisEclisiastica,
            new Date(item.fechaCreacion).toLocaleDateString('es-ES'),
            item.numDiocesisEstablecidas,
            item.numDiocesisExpansion,
            item.numRegiones
          ]);
        }
      });

      currentRow += pilar3Data.length + 1;
    }

    // Agregar los datos del pilar 4
    const pilar4Data = data[3]['response'];
    if (pilar4Data.length > 0) {
      // Fusionar celdas para el título "Cuarto Pilar"
      worksheet.mergeCells(`A${currentRow}:J${currentRow}`);
      const titleCell = worksheet.getCell(`A${currentRow}`);
      titleCell.value = 'Cuarto Pilar';
      titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
      currentRow++;

      // Agregar los encabezados como fila
      worksheet.addRow(headers.slice(0, 9));

      pilar4Data.forEach(item => {
        const itemYear = new Date(item.fechaCreacion).getFullYear();
        const itemCity = item.ciudad; // Nueva variable para almacenar la ciudad de cada registro
        if (itemYear === selectedYear && itemCity === selectedCity) { // Aplicar el filtro de año y ciudad
          worksheet.addRow([
            item.id,
            new Date(item.fechaCreacion).toLocaleDateString('es-ES'),
            item.numServidoresPostActivos,
            item.numFdsPostPeriodo,
            item.numMatrimonioVivieron,
            item.numComunidadApoyo,
            item.numServiciosComunidad,
            item.numMatrimoiosComunidad,
            item.numSacerdotesComunidad,
            item.numReligiososComunidad
          ]);
        }
      });
    }

    // Transponer los datos (columnas a filas)
const rowCount = worksheet.actualRowCount;
const columnCount = worksheet.actualColumnCount;
const transposedData = [];
for (let col = 1; col <= columnCount; col++) {
  const rowData = [];
  for (let row = 2; row <= rowCount; row++) {
    rowData.push(worksheet.getCell(row, col).value);
  }
  transposedData.push(rowData);
}

// Borrar las filas originales
worksheet.spliceRows(2, rowCount - 1);

// Calcular la nueva posición para agregar los datos transpuestos
const transposedRowCount = transposedData.length;
const transposedColumnCount = transposedData[0].length;
const startRow = rowCount + 2;

// Agregar los datos transpuestos en la nueva posición
for (let row = 0; row < transposedRowCount; row++) {
  for (let col = 0; col < transposedColumnCount; col++) {
    worksheet.getCell(startRow + row, col + 1).value = transposedData[row][col];
  }
}

    // Convertir el libro de Excel a un archivo binario y descargarlo
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Pilares.xlsx';
      link.click();
    });
  });
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

