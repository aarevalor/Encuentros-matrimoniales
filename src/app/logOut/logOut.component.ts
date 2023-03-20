import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logOut',
  templateUrl: './logOut.component.html',
  styleUrls: ['./logOut.component.css']
})
export class LogOutComponent {

  constructor(
    public dialogRef: MatDialogRef<LogOutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }

}