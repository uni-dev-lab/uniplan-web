import { Component } from '@angular/core';
  import { RouterLink } from '@angular/router';
  import { TranslatePipe } from '@ngx-translate/core';

  @Component({
    selector: 'app-not-found-panel',
    imports: [RouterLink, TranslatePipe],
    templateUrl: './not-found-panel.html',
    styleUrl: './not-found-panel.scss'
  })
  export class NotFoundPanel {}
