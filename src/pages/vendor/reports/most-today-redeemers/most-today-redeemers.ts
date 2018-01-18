import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { StatisticsPage } from "../../statistics/statistics";
import { VendorProvider } from "../../../../providers/vendor/vendor";
import { ConfigServiceProvider } from "../../../../providers/config-service/config-service";
import { User } from "../../../../models/user";

/**
 * Generated class for the MostTodayRedeemersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-most-today-redeemers',
  templateUrl: 'most-today-redeemers.html',
})
export class MostTodayRedeemersPage {

   loggedinUser = {};
  mostReedeemer =[];
  businessLogo = "assets/business-logo/user-default.png";
  constructor(public navCtrl: NavController, public navParams: NavParams,public menu:MenuController, public vendor: VendorProvider ,public config:ConfigServiceProvider) {
   let self = this;
    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
      console.log("this.loggedinUser");
      console.log(self.loggedinUser);
      if (self.loggedinUser['verified'] == true) {
        //nothig
         // self.getActiveRedeemer(self.loggedinUser["secretToken"]);
         self.getMostRedeemerToday();
      }
      else {
        self.config.showAlert("You are not verifed");
        self.navCtrl.pop();
      }
    }).catch((err)=>{
      this.config.printLog("",err);
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
  menuclick(){
    let self = this;
    self.navCtrl.setRoot(StatisticsPage);
  }
  getMostRedeemerToday(){
    console.log("hello");
     let self = this;
    let page =1;
    self.config.showLoading();
    self.vendor.getMostRedeemersToday(self.loggedinUser["secretToken"],page).then((response) => {
      if(response){
        self.mostReedeemer =response['data'];
      }
      self.config.hideloading();
      console.log(self.mostReedeemer);
    }).catch((error)=>{
      self.config.hideloading();
    });
  }

}
