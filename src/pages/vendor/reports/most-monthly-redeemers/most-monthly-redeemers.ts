import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { StatisticsPage } from "../../statistics/statistics";
import { VendorProvider } from "../../../../providers/vendor/vendor";
import { ConfigServiceProvider } from "../../../../providers/config-service/config-service";
import { User } from "../../../../models/user";

/**
 * Generated class for the MostMonthlyRedeemersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-most-monthly-redeemers',
  templateUrl: 'most-monthly-redeemers.html',
})
export class MostMonthlyRedeemersPage {

  loggedinUser = {};
  mostReedeemer = [];
  businessLogo = "assets/business-logo/user-default.png";
  date = new Date();
  year;
  month;
  min;
  max;
  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, public vendor: VendorProvider, public config: ConfigServiceProvider) {
    let self = this;
    let minyear = new Date();
    let minyears = new Date(minyear.setFullYear(minyear.getFullYear() - 5));
    this.min = minyears.getFullYear();
    let maxyear = new Date(minyear.setFullYear(minyear.getFullYear() + 12));
    this.max = maxyear.getFullYear();
    self.year = (self.date.getFullYear()).toString();
    self.month = self.date.getFullYear() + "-" + ('0' + (self.date.getMonth() + 1)).slice(-2) + "-" + self.date.getDate();
    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
      if (self.loggedinUser['verified'] == true) {
        self.getMostRedeemerMonthly();
      }
      else {
        self.config.showAlert("You are not verifed");
        self.navCtrl.pop();
      }
    }).catch((err) => {
      this.config.printLog("", err);
    });
    this.config.getLocalStore("profilePic").then((value) => {
      if (value) {
        this.businessLogo = value;
      }

    }).catch((err) => {
      console.log(err);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MostTodayRedeemersPage');
  }
  menuclick() {
    let self = this;
    self.navCtrl.setRoot(StatisticsPage);
  }
  getMostRedeemerMonthly() {
    let self = this;
    let data = {
      start: 1,
      year: self.year,
      month: self.date.getMonth() + 1
    };
    self.config.showLoading();
    self.vendor.getMostRedeemersMonthly(self.loggedinUser["secretToken"], data).then((response) => {
      if (response) {
        self.mostReedeemer = response['data'];
      }
      self.config.hideloading();
    }).catch((error) => {
      self.config.hideloading();
    });
  }
  getMonthwise() {
    let self = this;
    let filed = self.month.split('-');
    let data = {
      start: 1,
      year: self.year,
      month: filed[1]
    };
    self.config.showLoading();
    self.vendor.getMostRedeemersMonthly(self.loggedinUser["secretToken"], data).then((response) => {
      if (response) {
        this.mostReedeemer = response['data'];
      }
      self.config.hideloading();
    }).catch((error) => {
      this.mostReedeemer = [];
      self.config.hideloading();
    });
  }
}
