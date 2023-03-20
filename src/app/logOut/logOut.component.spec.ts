import { MatDialog } from '@angular/material/dialog';
import { LogOutComponent } from './logOut.component';

export class LogOutComponents {
  constructor(public dialog: MatDialog) {}

  confirmLogoff(): void {
    const dialogRef = this.dialog.open(LogOutComponent, {
      width: '250px',
      data: { message: 'Do you want to confirm logoff?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // perform logoff action here
      }
    });
  }