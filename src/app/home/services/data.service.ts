import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Player } from '../home.model';

const routes = {
  data: () => `/assets/data.json`
};

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
