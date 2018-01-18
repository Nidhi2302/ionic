import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ApiServiceProvider } from "../api-service/api-service";
import { User } from "../../models/user";
import { Vendor } from "../../models/vendor";
import { ConfigServiceProvider } from "../config-service/config-service";
import { Observable } from "rxjs/Observable";
import { File, FileEntry } from '@ionic-native/file';
/*
  Generated class for the VendorProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class VendorProvider {
serverDownMsg = "Server Busy . Please retry in a moment."
  constructor(public http: Http,
    public apiService: ApiServiceProvider,
    public config: ConfigServiceProvider) {
    console.log('Hello VendorProvider Provider');
  }
  createCoupon(coupon, token) {
    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader("/coupon/create-coupon", coupon, token).subscribe(res => {
        this.config.printLog('inside coupon apiService', res);
        resolve(res);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  getProfile(token) {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader("/user/vendor-profile", token).subscribe(res => {
        this.config.printLog('inside coupon apiService', res);
        let data = res["data"];
        let vedorData = new Vendor(data);
        resolve(vedorData);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  getCouponCount(token) {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader("/coupon/coupon-count", token).subscribe(res => {
        this.config.printLog('inside coupon apiService', res);
        let data = res;

        resolve(data);
      }, err => {
       const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          //this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  callStripe(stripeToken, token) {
    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader("/payment/subscribe", stripeToken, token).subscribe(res => {
        this.config.printLog('inside coupon apiService', res);
        resolve(res);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          this.config.showToast(error);
        }

        reject(error);
      });
    });
  }
  saveProfile(profile, token) {
    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader("/user/update-vendor-profile", profile, token).subscribe(res => {
        this.config.printLog('inside coupon apiService', res);
        resolve(res);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  saveProfilePicture(picture, token) {
    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader("/user/profile-image", picture, token).subscribe(res => {
        this.config.printLog('inside coupon apiService', res);
        resolve(res);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  getUserPlan(token) {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader("/user/get-user-plan",token).subscribe(res => {
        this.config.printLog('inside coupon apiService', res);
        resolve(res);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  cancelUserPlan(token){
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader("/payment/cancel-subscription",  token).subscribe(res => {
        this.config.printLog('inside coupon publish apiService', res);
        resolve(res);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          //this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  updateUserPlan(token,plan){
        this.config.printLog('inside coupon publish apiService',plan);

    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader("/payment/update-vendor-subscription", plan, token).subscribe(res => {
        this.config.printLog('inside coupon publish apiService', res);
        resolve(res);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          //this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  publishCoupon(param, token) {
    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader("/coupon/publish-coupon", param, token).subscribe(res => {
        this.config.printLog('inside coupon publish apiService', res);
        resolve(res);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          //this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  updateCoupon(param, token) {
    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader("/coupon/update-coupon", param, token).subscribe(res => {
        this.config.printLog('inside update coupon  apiService', res);
        resolve(res);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  saveCoupon(param, token) {
    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader("/wallet/save-coupon", param, token).subscribe(res => {
        this.config.printLog('inside update coupon  apiService', res);
        resolve(res);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          this.config.showToast(error);
        }
        reject(error);
      });
    });
  }

  getSaveCoupon(token) {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader("/wallet/get-save-coupon/", token).subscribe(res => {
        this.config.printLog('inside wallet apiService', res);
        resolve(res);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          //this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
 deleteCoupon(param,token){
  return new Promise((resolve, reject) => {
    this.apiService.deleteWithHeader("/coupon/delete-coupon/" + param, token).subscribe(res => {
      this.config.printLog('inside delete coupon apiService', res);
      resolve(res);
    }, err => {
      const error = err.json();
       if (err.status && err.status == 0) {
        this.config.showToast(this.serverDownMsg);
      } else {
        this.config.showToast(error);
      }
      reject(error);
    });
  });
 }
  getCurrentCoupon(token, page,vendorID) {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader("/coupon/current-coupon-inventory/" + page+"/"+vendorID, token).subscribe(res => {
        this.config.printLog('inside coupon apiService', res);
        resolve(res);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          //this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  getExpiredCoupon(token, page) {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader("/coupon/expiry-coupon-inventory/" + page, token).subscribe(res => {
        this.config.printLog('inside coupon apiService', res);
        resolve(res);
      }, err => {
       const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          //this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  getActiveRedeemers(token, page) {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader("/reports/most-redeemers/" + page, token).subscribe(res => {
        this.config.printLog('inside reports apiService', res);
        resolve(res);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  getLeastRedeemers(token, page) {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader("/reports/least-redeem/" + page, token).subscribe(res => {
        this.config.printLog('inside reports apiService', res);
        resolve(res);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  getMostRedeemersToday(token, page) {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader("/reports/today-redeem/" + page, token).subscribe(res => {
        this.config.printLog('inside reports apiService', res);
        resolve(res);
      }, err => {
       const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  getMostRedeemersMonthly(token, data) {
    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader("/reports/monthly-redeemers", data, token).subscribe(res => {
        this.config.printLog('inside reports apiService', res);
        resolve(res);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  getFollowers(token, page) {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader("/follower/getfollowers/" + page, token).subscribe(res => {
        this.config.printLog('inside coupon apiService', res);
        resolve(res);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          //this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  getGeoLocation(address) {
    return new Promise((resolve, reject) => {
      this.apiService.getThird("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyDI3mtBSE-K4a8Jq7h8V9D1VkT1ASvaR5E&language=en&region=EN").subscribe(res => {
        this.config.printLog('inside apiService', res);
        resolve(res);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          //this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  getCoupon(id, token) {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader("/coupon/getcoupon/" + id, token).subscribe(res => {
        this.config.printLog('inside coupon apiService', res);
        let coupon = res["data"][0];
        resolve(coupon);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
  getPlan(token) {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader("/user/plan", token).subscribe(res => {
        this.config.printLog('inside coupon apiService', res);
        let plan = res['plan'];
        resolve(plan);
      }, err => {
        const error = err.json();
         if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          this.config.showToast(error);
        }
        reject(error);
      });
    });
  }
}
