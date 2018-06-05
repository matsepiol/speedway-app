import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  data: () => `/assets/data.json`
};

interface Player {
  name: string;
  type: string;
  ksm: number;
  team: string;
}

@Injectable()
export class DataService {

  constructor(private httpClient: HttpClient) { }

  getData(): Observable<Player[]> {
    return this.httpClient
      .cache()
      .get(routes.data())
      .pipe(
        map((body: any) => body.data),
        catchError(() => of('Error'))
      );
  }

}
