import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'facultyNamePipe',
})

export class FacultyNamePipe implements PipeTransform {

  transform(id: string, facultyMap: Map<string, string>): string {
    return facultyMap.get(id) || '—';
  }

}
