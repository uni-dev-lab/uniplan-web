import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,map  } from 'rxjs';
import { CategoryElm } from '../../core/interfaces/category-elm';
import { API_ENDPOINTS } from '../../config/endpoints';

@Injectable({
    providedIn: 'root'
})

export class CategoryService {
  http = inject(HttpClient);

  getCategories(): Observable<CategoryElm[]> {
    return this.http.get<CategoryElm[]>(API_ENDPOINTS.categories).pipe(
      map((categories) =>
        categories.map((category, index) => ({
          id: category.id,
          roomType: category.roomType,
          capacity: category.capacity,
          position: index + 1,
        }))
      )
    );
  }
}
