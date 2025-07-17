import { Component } from '@angular/core';
import { Table } from "./table/table";
import { FacultyOptions } from "../../../features/faculty/faculty-options/faculty-options";

@Component({
  selector: 'app-main-panel',
  imports: [Table, FacultyOptions],
  standalone: true,
  templateUrl: './main-panel.html',
  styleUrl: './main-panel.scss'
})
export class MainPanel {

}
