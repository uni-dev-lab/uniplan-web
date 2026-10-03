import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryDisplayPipe',
})

export class CategoryDisplayPipe implements PipeTransform {

  transform(id: string, categoryMap: Map<string, string>): string {
    return categoryMap.get(id) || '—';
  }

}
