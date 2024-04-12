import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-progress-spinner-dialog',
  standalone: true,
  imports: [
    MatProgressSpinnerModule
  ],
  templateUrl: './progress-spinner-dialog.component.html',
  styleUrls: ['./progress-spinner-dialog.component.scss']
})
export class ProgressSpinnerDialogComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
