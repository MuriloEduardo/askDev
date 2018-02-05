import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PagamentosService {

  baseUrl = 'https://us-central1-ask-dev0.cloudfunctions.net/api';

  constructor(private http: Http) { }

  create(url: string, body: any): Promise<any> {
    return this.http
      .post(this.baseUrl + url, body)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  get(url: string): Promise<any> {
    return this.http
      .get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
