import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ApiServiceProvider } from '../api-service/api-service';
import { ConfigServiceProvider } from '../config-service/config-service';

/*
  Generated class for the BranchioProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class BranchioProvider {
  Branch = window['Branch'];

  constructor(public http: Http,
    public apiService: ApiServiceProvider,
    public config: ConfigServiceProvider) {
    console.log('Hello BranchioProvider Provider');
  }
  getSharedLink(couponId, userId, vendorId) {
    let self = this;
    let Branch = window['Branch'];
    return new Promise((resolve, reject) => {
      let properties = {
        canonicalIdentifier: 'Qupey',
        title: "Qupey",
        contentDescription: "coupon share",
        contentMetadata: { "couponId": couponId, "userId": userId, "vendorId": vendorId }
      }
      Branch.createBranchUniversalObject(properties).then(function (res) {
        let branchUniversalObj = res
        console.log('Response: ', branchUniversalObj)
        let analytics = { tags: ['qupey'] }
        let propertiesBranchLink = {};
        branchUniversalObj.generateShortUrl(analytics, propertiesBranchLink).then(deepLinkRes => {
          console.log("deepLinkRes", deepLinkRes.url);
          resolve(deepLinkRes.url)
        }).catch(deep_link_error => {
          console.log(deep_link_error);
          reject(deep_link_error)
        });

      }).catch(function (err) {
        console.log('Error: ', err);
        reject(err);
      })

    })
  }

  
}
