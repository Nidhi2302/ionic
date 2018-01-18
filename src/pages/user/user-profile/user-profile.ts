import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { UserServiceProvider } from "../../../providers/user-service/user-service";
import { LoginPage } from "../../login/login/login";
import { UserUpdateProfilePage } from "../user-update-profile/user-update-profile";
import { UserFollowersPage } from "../user-followers/user-followers";
import { User } from '../../../models/user';
import { SettingPage } from '../setting/setting';
import { NotificationPage } from '../notification/notification';
import { Badge } from '@ionic-native/badge';

/**
 * Generated class for the UserProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  savedCouponCount;
  followerCount;
  redeemCount;
  points;
  pages = [
    {
      name: "Profile",
      page: UserUpdateProfilePage
    },
    {
      name: "Following",
      page: UserFollowersPage
    },
   
    {
      name: "Activity",
      page: NotificationPage
    },
    {
      name: "Notifications",
      page: SettingPage
    },
    // {
    //   name: "Logout",
    //   page: "Logout"
    // }
  ]
  loggedinUser = {};
  constructor( public alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams, public userService: UserServiceProvider,
    public config: ConfigServiceProvider, private events: Events,private badge: Badge) {
    let self = this;
    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
      console.log("loggedinUser", self.loggedinUser);
    }).catch((err) => {
      this.config.printLog("", err);
    });
    self.events.subscribe("updateProfile", (user) => {
      self.loggedinUser['name'] = user.name;
      self.loggedinUser['user_basic_information'] = user.user_basic_information;
      self.loggedinUser['username'] = user.username;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
  }
  logout() {
    let self = this;
    let settings={
      newQupeyNotify : self.loggedinUser["newQupeyNotify"],
      expQupeyNotify : self.loggedinUser["expQupeyNotify"],
      redemptionNotify:self.loggedinUser["redemptionNotify"],
      newBusinessNotify :self.loggedinUser["newBusinessNotify"],
    }
    const alert = this.alertCtrl.create({
      message:"Are you sure, you want to Logout?" ,
      title: "Alert",
      buttons: [{
        text:'Ok',
        handler:()=>{
          self.config.showLoading();
          
              self.userService.logout(settings,self.loggedinUser["secretToken"]).then((res) => {
                self.config.hideloading();
                this.badge.clear();
                this.navCtrl.push(LoginPage, { "type": "user" });
              });
        }
      },
      {
      text:'Cancel',
      handler: () => {
        self.config.hideloading();
        console.log('Cancel clicked');
      }
       } ]
    });
    alert.present();
    
  }
  setPages(item) {
    let self = this;
    if (item == "Logout") {
      self.logout();
    }
    else if (item == "Wallet") {
      self.switchTabs(3);
    }
    else {
      self.navCtrl.push(item);
    }
  }
  switchTabs(tab) {
    console.log("this.navCtrl.parent", this.navCtrl.parent);
    this.navCtrl.parent.select(tab);
  }
  ionViewDidEnter(){
    let self=this;
    self.config.showLoading();
    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
      self.userService.getNumbers(self.loggedinUser["secretToken"]).then((response) => {
        self.config.printLog("",response);
        self.config.hideloading();
        self.savedCouponCount=response["savedCouponCount"].length;
        self.followerCount=response["followerCount"];
        self.redeemCount=response["redeemCoupon"];
        self.points=response["points"];
       }).catch(err => {
        self.config.hideloading();
         console.log(err);
       });
    }).catch((err) => {
      self.config.hideloading();
      this.config.printLog("", err);
    });
    
    
  }
}
