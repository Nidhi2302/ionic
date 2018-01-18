import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UserServiceProvider } from '../../../providers/user-service/user-service';
import { ConfigServiceProvider } from '../../../providers/config-service/config-service';
import { User } from '../../../models/user';
import { Badge } from '@ionic-native/badge';


/**
 * Generated class for the SettingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  loggedinUser = {};
  listMsg=[];
  htmlStr = "<div class='des'><span class='highlight'>Sally Smith </span>redeemed a qupey you shared from <span class='highlight'> The Red Rooster </span></div><div class='pts'>3 pts</div>";
  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserServiceProvider,private badge: Badge,
    public config: ConfigServiceProvider) {
    let self = this;
    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
      self.getNotification(self.loggedinUser["secretToken"]);
    }).catch((err) => {
      this.config.printLog("", err);
    });
    this.badge.clear();
  }
  previous() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }
  getNotification(token){
    let self=this;
    self.config.showLoading();
    self.userService.getNotifications(token).then((listMsg:any)=>{
      console.log(listMsg);
      self.listMsg=listMsg;
      self.config.hideloading();
    }).catch((error)=>{

    })
  }
}
