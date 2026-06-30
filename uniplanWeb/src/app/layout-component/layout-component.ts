import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavmenuComponent } from "../core/shared/navmenu-component/navmenu-component";

@Component({
  selector: 'app-layout-component',
  imports: [NavmenuComponent, RouterOutlet],
  templateUrl: './layout-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './layout-component.scss'
})
export class LayoutComponent {

}
