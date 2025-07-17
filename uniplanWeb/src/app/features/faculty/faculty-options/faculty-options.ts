import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-faculty-options',
  imports: [CommonModule ,MatTableModule, MatIconModule, MatButtonModule],
  standalone: true,
  templateUrl: './faculty-options.html',
  styleUrl: './faculty-options.scss'
})
export class FacultyOptions {

}
