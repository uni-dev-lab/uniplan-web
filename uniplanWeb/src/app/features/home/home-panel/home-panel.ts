import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home-panel',
  templateUrl: './home-panel.html',
  styleUrl: './home-panel.scss',
  imports: [TranslatePipe],
})
export class HomePanel {}
