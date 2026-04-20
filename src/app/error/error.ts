import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

interface DialogData {
  // Define your dialog data properties here
  message: string;
}

@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './error.html',
  styleUrl: './error.scss',
})
export class Error {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) {}


}
