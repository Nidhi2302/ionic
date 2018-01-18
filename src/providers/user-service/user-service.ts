import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ApiServiceProvider } from "../api-service/api-service";
import { User } from "../../models/user";
import { ConfigServiceProvider } from "../config-service/config-service";


/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UserServiceProvider {
  serverDownMsg = "Server Busy . Please retry in a moment."
  constructor(
    public apiService: ApiServiceProvider,
    public config: ConfigServiceProvider) {

  }

  currentUserData

  login(loginData): any {
    let self = this;
    return new Promise((resolve, reject) => {
      this.apiService.post('/user/login', loginData).subscribe(res => {
        let data = res['result']["uData"];
        let secreteToken = res['result']["secreteToken"];
        data['secretToken'] = secreteToken;
        self.config.printLog(data, res);
        let loggedUser = new User(data);
        self.config.setLocalStore("profilePic", data.logo);
        self.config.setLocalStore("backgroundPic", data.background_image);
        self.config.setLocalStore("LoggedUser", loggedUser)
        //this.config.setLocalStore("id_token", loggedUser.secretToken)
        self.config.setLocalStore("isUserLogged", true)
        resolve(data);
      }, (err) => {
        //console.log(err.status)
        if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          const error = err.json();
          this.config.showToast(error);
        }
        reject(err);
      });
    });
  }
  logout(settings,token) {
    let self = this;
    return  new Promise((resolve, reject) => {
      this.apiService.postWithHeader("/user/logout", settings,token)
    .subscribe(res => {
       self.config.clearStorage();
       resolve(null)
    }, err => {
      self.config.clearStorage();
      reject(null)
    });
  })
  }
  saveLink(param,token) {
    let self = this;
    return  new Promise((resolve, reject) => {
      this.apiService.postWithHeader("/share/save-link", param,token)
    .subscribe(res => {
      
       resolve(res)
    }, err => {
     
      reject(err)
    });
  })
  }
  registration(registrationData) {
    let self = this;
    return new Promise((resolve, reject) => {
      this.apiService.post("/user/registration", registrationData)
        .subscribe(res => {
          let data = res["data"];
          let registeredUser = new User(data);
          console.log("logo",registeredUser.userData.logo);

          self.config.printLog("inside reg", registeredUser);
          self.config.setLocalStore("LoggedUser", registeredUser);
          //this.config.setLocalStore("id_token", registeredUser.secretToken);
          self.config.setLocalStore("isUserLogged", true);

          registeredUser['message'] = res["message"];
          resolve(registeredUser);
        }, err => {
          if (err.status && err.status == 0) {
            self.config.showToast(this.serverDownMsg);
          } else {
            const error = err.json();
            self.config.showToast(error);
          }
          reject(err);
        });
    });
  }
  isEmailExists(email) {
    console.log(email);
    return new Promise((resolve, reject) => {
      this.apiService.post("/user/email-exists", email).subscribe(res => {
        this.config.printLog('inside apiService', res);
        resolve(res);
      }, err => {
        if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          const error = err.json();
          this.config.showToast(error);
        }
        reject(err);
      });
    });
  }
  getOtp(number) {
    return new Promise((resolve, reject) => {
      this.apiService.post("/user/otp", number).subscribe(res => {
        this.config.printLog('inside apiService', res);
        resolve(res);
      }, err => {
        if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          const error = err.json();
          this.config.showToast(error);
        }
        reject(err);
      });
    });
  }
  isUsernameExists(username) {
    return new Promise((resolve, reject) => {
      this.apiService.post("/user/username-exists", username).subscribe(res => {
        this.config.printLog('inside apiService', res);
        resolve(res);
      }, err => {
        // if (err.status && err.status == 0) {
        //   this.config.showToast(this.serverDownMsg);
        // } else {
        //   const error = err.json();
        //   //this.config.showToast(error);
        // }
        reject(err);
      });
    });
  }
  getProfile(token) {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader("/user/user-profile", token).subscribe(res => {
        this.config.printLog('inside coupon apiService', res);
        let data = res["data"];
        let vedorData = new User(data);
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
  getNotifications(token) {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader("/notification/get-notifications", token).subscribe(res => {
        this.config.printLog('inside coupon apiService', res);
        let data = res["data"];
       
        resolve(data);
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
  getNumbers(token) {
    return new Promise((resolve, reject) => {
      this.apiService.getWithHeader("/user/all-numbers", token).subscribe(res => {
        this.config.printLog('inside numbers apiService', res);
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
      this.apiService.postWithHeader("/user/update-user-profile", profile, token).subscribe(res => {
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
  redeemCoupon(coupon, token) {
    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader("/coupon/redeem-coupon", coupon, token).subscribe(res => {
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
  saveSetting(setting, token) {
    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader("/user/save-setting", setting, token).subscribe(res => {
        this.config.printLog('inside setting apiService', res);
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
  setFollow(param,token){
    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader("/follower/follow", param, token).subscribe(res => {
        this.config.printLog('inside setFav apiService', res);
        //this.config.showToast(res.message);
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
  forgotPwd(email) {
    return new Promise((resolve, reject) => {
      this.apiService.post("/user/forgot-password", email).subscribe(res => {
        this.config.printLog('inside apiService', res);
        resolve(res);
      }, err => {
        if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          const error = err.json();
          //this.config.showToast(error);
          if (error.indexOf("exists") < 1) {
            this.config.showToast("you can not get password of social login");
          } else {
            this.config.showToast(error);
          }
        }
        reject(err);
      });
    });
  }
  socialmediaLogin(loginData) {
    let self=this;
    return new Promise((resolve, reject) => {
      this.apiService.post("/user/login-social-media", loginData).subscribe(res => {
        let data = res['result']["uData"];
        let secreteToken = res['result']["secreteToken"];
        data['secretToken'] = secreteToken;
        self.config.printLog(data, res);
        let loggedUser = new User(data);
        self.config.setLocalStore("profilePic", data.logo);
        self.config.setLocalStore("backgroundPic", data.background_image);
        self.config.setLocalStore("LoggedUser", loggedUser)
        //this.config.setLocalStore("id_token", loggedUser.secretToken)
        self.config.setLocalStore("isUserLogged", true)
        this.config.printLog('inside apiService', res);        
        resolve(data);
      }, err => {
        const error = err.json();
        this.config.showToast(JSON.stringify(error));
        reject(error);
      });
    });
  }
  changePassword(data,token){
    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader("/user/change-password/", data, token).subscribe(res => {
        this.config.printLog('inside coupon apiService', res);
        resolve(res);
      }, err => {
        if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          const error = err.json();
          this.config.showToast(error);
        }
        reject(err);
      });
    });
  }
  getNearByVendor(location, token) {
    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader("/user/near-by-vendors/", location, token).subscribe(res => {
        this.config.printLog('inside coupon apiService', res);
        let data = res['vendors'];
        resolve(data);
      }, err => {
        if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          const error = err.json();
          //this.config.showToast(error);
        }
        reject(err);
      });
    });
  }
  getNearByVendorCouponCount(location, token) {
    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader("/user/vendor-coupon-count/", location, token).subscribe(res => {
        this.config.printLog('inside coupon apiService', res);
        let data = res['vendors'];
        resolve(data);
      }, err => {
        if (err.status && err.status == 0) {
          this.config.showToast(this.serverDownMsg);
        } else {
          const error = err.json();
          //this.config.showToast(error);
        }
        reject(err);
      });
    });
  }
  chargeCreate(params, token) {
    return new Promise((resolve, reject) => {
      this.apiService.postWithHeader("/user/charge-create", params, token).subscribe(res => {
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
}


