import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, InfiniteScroll } from 'ionic-angular';
import { StatisticsPage } from "../../statistics/statistics";
import { User } from "../../../../models/user";
import { VendorProvider } from "../../../../providers/vendor/vendor";
import { ConfigServiceProvider } from "../../../../providers/config-service/config-service";

/**
 * Generated class for the ActiveRedeemersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-active-redeemers',
  templateUrl: 'active-redeemers.html',
})
export class ActiveRedeemersPage {
  loggedinUser = {};
  activeReedeemer =[];
  hasMoreData =false;
   page =1;
   businessLogo= "assets/business-logo/user-default.png";
  constructor(public navCtrl: NavController, public navParams: NavParams,public menu:MenuController, public vendor: VendorProvider ,public config:ConfigServiceProvider) {
   let self = this;
    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
      console.log("this.loggedinUser");
      console.log(self.loggedinUser);
      if (self.loggedinUser['verified'] == true) {
        //nothig
         // self.getActiveRedeemer(self.loggedinUser["secretToken"]);
         self.getActiveRedeemer();
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActiveRedeemersPage');
  }
  menuclick(){
    let self = this;
    self.navCtrl.setRoot(StatisticsPage);
  }
  getActiveRedeemer(){
     let self = this;
    self.config.showLoading();
    self.vendor.getActiveRedeemers(self.loggedinUser["secretToken"],self.page).then((response) => {
      if(response['data']){
        self.activeReedeemer =response['data'];
      }
      self.config.hideloading();
      console.log(self.activeReedeemer);
    }).catch((error)=>{
      self.config.hideloading();
    });
  }
loadMoreFeedData(infiniteScroll: InfiniteScroll){
    let self =this;
    self.page +=1;
    self.vendor.getActiveRedeemers(self.loggedinUser["secretToken"],self.page).then((response) => {
      self.hasMoreData =true;
      console.log(response);
      if(response['data']){
         console.log("hello");
         console.log(response['data']);
         for(let i=0; i<response['data'].length;i++){
            self.activeReedeemer.push( response['data'][i]);
         }
         if (self.activeReedeemer.length > 1000000000) {
          infiniteScroll.enable(false);
        }
      }else{
         console.log("hello1");
         infiniteScroll.enable(false);
        self.hasMoreData =false;
      }
      infiniteScroll.complete();
      
    }).catch((error)=>{
      self.hasMoreData =false;
    });
}
}
