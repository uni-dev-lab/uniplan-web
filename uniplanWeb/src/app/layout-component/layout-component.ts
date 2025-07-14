import { Component } from '@angular/core';
import { NavmenuComponent } from "../core/shared/navmenu-component/navmenu-component";

@Component({
  selector: 'app-layout-component',
  imports: [NavmenuComponent],
  standalone: true,
  templateUrl: './layout-component.html',
  styleUrl: './layout-component.scss'
})
export class LayoutComponent {

}
