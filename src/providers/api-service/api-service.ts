import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigServiceProvider } from "../config-service/config-service";

/*
  Generated class for the ApiServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ApiServiceProvider {
  APP_URL = this.config.get('APP_URL');
  disconnetMsg="Please make sure that you are connected to the internet"
  constructor(public http: Http, public config: ConfigServiceProvider) { }
  post(URL, data) {
    console.log(this.config.isConnect);
    if (this.config.isConnect) {
      this.config.printLog(this.APP_URL + URL, data);
      let response = this.http.post(this.APP_URL + URL, data).map(res => res.json());
      this.config.printLog('inside post', response);
      return response
    }
    else {
      this.config.showAlert(this.disconnetMsg)
    }

  }
  postWithHeader(URL, data, xAuthToken) {
     if (this.config.isConnect) {
    let headers = new Headers();
    headers.append('x-auth-token', xAuthToken);
    let response = this.http.post(this.APP_URL + URL, data, { headers: headers })
      .map(res => res.json());

    return response
    }
    else {
      this.config.showAlert(this.disconnetMsg)
    }
  }
  deleteWithHeader(URL, xAuthToken) {
    if (this.config.isConnect) {
   let headers = new Headers();
   headers.append('x-auth-token', xAuthToken);
   let response = this.http.delete(this.APP_URL + URL, { headers: headers })
     .map(res => res.json());

   return response
   }
   else {
     this.config.showAlert(this.disconnetMsg)
   }
 }
  getWithHeader(URL, xAuthToken) {
     if (this.config.isConnect) {
    let headers = new Headers();
    headers.append('x-auth-token', xAuthToken);
    let response = this.http.get(this.APP_URL + URL, { headers: headers })
      .map(res => res.json());

    return response
     }
    else {
      this.config.showAlert(this.disconnetMsg)
    }
  }
  getThird(URL) {
     if (this.config.isConnect) {
    let response = this.http.get(URL)
      .map(res => res.json());

    return response
     }
    else {
      this.config.showAlert(this.disconnetMsg)
    }
  }
}
