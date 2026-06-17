import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavmenuComponent } from "../core/shared/navmenu-component/navmenu-component";
import { MainPanel } from "../core/shared/main-panel/main-panel";

@Component({
  selector: 'app-layout-component',
  templateUrl: './layout-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './layout-component.scss',
  imports: [NavmenuComponent, MainPanel],
})
export class LayoutComponent {

}
