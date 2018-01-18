import { Component } from '@angular/core';
import { IonicPage, NavController,MenuController, NavParams } from 'ionic-angular';
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { User } from "../../../models/user";
import { VendorProvider } from "../../../providers/vendor/vendor";
/**
 * Generated class for the FollowersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-followers',
  templateUrl: 'followers.html',
})
export class FollowersPage {
  loggedinUser = {};
  followersData =[];
  serachFollowersData=[];
  businessBack = "assets/business-image/VendorDefault.jpg";
  businessLogo="assets/business-logo/user-default.png";
  constructor(public navCtrl: NavController,public menu:MenuController ,public navParams: NavParams,public config:ConfigServiceProvider, public vendor: VendorProvider) {
    let self = this;

    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
      console.log("this.loggedinUser");
      console.log(self.loggedinUser);
      if (self.loggedinUser['verified'] == true) {
        //nothig
          self.followers()
      }
      else {
        self.config.showAlert("You are not verifed");
        self.navCtrl.pop();
      }
    }).catch((err)=>{
      this.config.printLog("",err);
    });
    self.config.getLocalStore("profilePic").then((value) => {
      if(value){
        this.businessLogo=value;
      }
    }).catch((err) => {
      console.log(err);
    })
    self.config.getLocalStore("backgroundPic").then((value) => {
      if(value){
        this.businessBack=value;
      }
      }).catch((err) => {
      console.log(err);
    })
  }
  filterItems(ev: any) {
  //console.log("eve",ev);
   let self =this;
   self.followersData=self.serachFollowersData;
    let val = ev.target.value;

    if (val && val.trim() !== '') {
      self.followersData = self.followersData.filter(function(item) {
        return item.name.toLowerCase().includes(val.toLowerCase());
      });
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowersPage');
  }
  clickMenu(){
    let self = this;
    self.menu.open();
  }
  followers(){
    let self = this;
    let page =1;
    self.vendor.getFollowers(self.loggedinUser["secretToken"],page).then((response) => {
      self.followersData =response['data'];
      self.serachFollowersData =response['data'];
      console.log(self.followersData);
    }).catch((err)=>{
      self.config.printLog('',err);
    });
  }
}
