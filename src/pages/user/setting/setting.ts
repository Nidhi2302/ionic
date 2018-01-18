import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UserServiceProvider } from '../../../providers/user-service/user-service';
import { ConfigServiceProvider } from '../../../providers/config-service/config-service';
import { User } from '../../../models/user';
import { VendorProvider } from '../../../providers/vendor/vendor';


/**
 * Generated class for the SettingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  loggedinUser = {}
  redemption ;
  expQupey ;
  newQupey ;
  newBusiness;
  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserServiceProvider,
    public config: ConfigServiceProvider) {
    let self = this;
    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
      self.newQupey = self.loggedinUser["newQupeyNotify"];
      self.expQupey = self.loggedinUser["expQupeyNotify"];
      self.redemption = self.loggedinUser["redemptionNotify"];
      self.newBusiness = self.loggedinUser["newBusinessNotify"];
    }).catch((err) => {
      this.config.printLog("", err);
    });
  }
  previous() {
    this.navCtrl.pop();
  }
  saveSetting(type, item) {
    //console.log(this.newQupey, this.expQupey, this.redemption, this.newBusiness);
    let self = this;
    let param = {}
    switch (type) {
      case "newQupeyNotify":
        param = {
          "newQupeyNotify": item
        };
        break;
      case "expQupeyNotify":
        param = {
          "expQupeyNotify": item
        };
        break;
      case "redemptionNotify":
        param = {
          "redemptionNotify": item
        };
        break;
      case "newBusinessNotify":
        param = {
          "newBusinessNotify": item
        };
        break;
      default: param = {}; break;
    }

    self.userService.saveSetting(param, self.loggedinUser["secretToken"]).then((response) => {
      self.loggedinUser[type] = response[type];
      self.newQupey = self.loggedinUser["newQupeyNotify"];
      self.expQupey = self.loggedinUser["expQupeyNotify"];
      self.redemption = self.loggedinUser["redemptionNotify"];
      self.newBusiness = self.loggedinUser["newBusinessNotify"];
      self.config.setLocalStore("LoggedUser", self.loggedinUser);
      //self.config.showToast(response);
    }).catch(err => {
      console.log(err);
    });
  }
  ionViewDidEnter() {
    let self = this;
    self.newQupey = self.loggedinUser["newQupeyNotify"];
    self.expQupey = self.loggedinUser["expQupeyNotify"];
    self.redemption = self.loggedinUser["redemptionNotify"];
    self.newBusiness = self.loggedinUser["newBusinessNotify"];
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

}
