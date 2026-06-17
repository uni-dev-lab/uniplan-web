import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSlideToggleModule],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  styleUrl: './app.scss'
})
export class App {
  protected title = 'uniplanWeb';
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('/api/faculties/4cfd003a-10c6-4fd2-bb95-3f4ce5a4cd4f').subscribe({
      next: (res) => console.log('Success:', res),
      error: (err) => console.error('Error:', err)
    });
  }
}
