import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { User } from "../../../models/user";
import { ActiveRedeemersPage } from "../reports/active-redeemers/active-redeemers";
import { MostMonthlyRedeemersPage } from "../reports/most-monthly-redeemers/most-monthly-redeemers";
import { MostTodayRedeemersPage } from "../reports/most-today-redeemers/most-today-redeemers";
import { LeastRedeemersPage } from "../reports/least-redeemers/least-redeemers";
import { LoginPage } from "../../login/login/login";
import { UserServiceProvider } from "../../../providers/user-service/user-service";
/**
 * Generated class for the StatisticsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})
export class StatisticsPage {
  loggedinUser ={};
  pages;
  businessBack = "assets/business-image/VendorDefault.jpg";
  businessLogo = "";
  constructor(public navCtrl: NavController,
     public userService: UserServiceProvider,public navParams: NavParams,
     public menu:MenuController,public config:ConfigServiceProvider) {
    let self =this;
    this.menu.enable(true);
    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
      console.log("this.loggedinUser");
      console.log(self.loggedinUser);
      if (self.loggedinUser['verified'] == true) {
        //nothig
          self.pages = [
            { title: 'Most Active Redeemers', component: ActiveRedeemersPage },
            { title: 'Most Redeemed Qupeys(Today)', component: MostTodayRedeemersPage },
            { title: 'Most Redeemed Qupeys(Monthly)', component: MostMonthlyRedeemersPage },
            { title: 'Least Redeemed Quepey(Overall)', component: LeastRedeemersPage },
          ];
      }
      else {
        self.config.showAlert("You are not verifed");
        self.navCtrl.pop();
      }
    }).catch((err)=>{
      this.config.printLog("",err);
    });
    this.config.getLocalStore("profilePic").then((value) => {
      if(value){
        this.businessLogo=value;
      }

    }).catch((err) => {
      console.log(err);
    })
    this.config.getLocalStore("backgroundPic").then((value) => {
      if(value){
        this.businessBack=value;
      }
      }).catch((err) => {
      console.log(err);
    })
  }



  clickMenu(){
    let self = this;
    self.menu.open();
  }
  openPage(page) {
     this.menu.close();
     this.navCtrl.setRoot(page.component);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatisticsPage');
  }

}
