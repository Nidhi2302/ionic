import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { User } from '../../../models/user';
import { UserServiceProvider } from '../../../providers/user-service/user-service';
import { ConfigServiceProvider } from '../../../providers/config-service/config-service';
import { Geolocation } from '@ionic-native/geolocation';
/**
 * Generated class for the UserFollowersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-followers',
  templateUrl: 'user-followers.html',
})
export class UserFollowersPage {
  loggedinUser = {};
  simpleVendorList=[];
  vendorList=[];
  isLocationAvl = false;
  page=1
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public userService: UserServiceProvider,
    public config: ConfigServiceProvider,
    private geolocation: Geolocation,
    private events: Events) {
    let self=this;
    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
      self.getNearByVendor(this.page);
    }).catch((err) => {
      this.config.printLog("", err);
    });
    this.events.unsubscribe("changeFollowStatus2")
    this.events.subscribe("changeFollowStatus2", (vendor) => {
      self.vendorList = self.vendorList.map((v) => {
        if (v.vendor_id == vendor.vendorId) {
          v.status = "Unfollow";
        }
        return v
      })
      if (vendor.vendorList) {
        self.simpleVendorList = vendor.vendorList;
      }
      else {
        self.simpleVendorList = self.vendorList;
      }
      self.vendorList = self.simpleVendorList.filter((i) => i.status=="Follow")
    })
  }
  getNearByVendor(start) {
    this.config.showLoading();
    let self = this;
    self.geolocation.getCurrentPosition().then((resp) => {
      this.isLocationAvl = true;
      self.config.printLog("current position :", resp);
      let location = {
        "longitude": resp.coords.longitude,
        "latitude": resp.coords.latitude,
        "start": start
      }
    self.userService.getNearByVendor(location, self.loggedinUser["secretToken"]).then((list:any) => {
      self.config.printLog("vendor list", list);
      list.sort((a: any, b: any) => {
        if (a.distance.calculated < b.distance.calculated ){
        //a is the Object and args is the orderBy condition (data.likes.count in this case)
            return -1;
        }else if(a.distance.calculated >b.distance.calculated  ){
            return 1;
        }else{
            return 0;
        }
    });
    self.simpleVendorList=list;
    list=list.filter((i)=>i.status=="Follow")
      self.vendorList = list;
     
      this.config.hideloading();
    }).catch((err) => {
      self.config.printLog("vendor list", Object.keys(self.vendorList).length);
      this.config.hideloading();
      self.config.printLog("", err);
    })
  }).catch((error) => {
    this.isLocationAvl = false;
    console.log('Error getting location', error);
  });
   
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad UserFollowersPage');
  }
  previous(){
    this.navCtrl.pop();
  }
  setFollwer(item) {
    let self = this
   
    //this.config.showLoading();
    let param = {
      "vendorId": item.vendor_id,
      "status": 'Unfollow'
    }

    this.userService.setFollow(param, this.loggedinUser["secretToken"]).then((res) => {
      self.config.showToast(item.vendorname + " " + res);
      self.events.publish("changeFollowStatus", { "vendorId": item.vendor_id});
     self.events.publish("changeFollowStatus2", { "vendorId": item.vendor_id});
      self.config.hideloading();
    }).catch((err) => {
      self.config.hideloading();
      self.config.printLog("", err);
    });
  }

  doInfiniteFollower(infiniteScroll) {
    let self = this;
    this.page = this.page + 1;
    self.geolocation.getCurrentPosition().then((resp) => {
      self.isLocationAvl = true;
      self.config.printLog("current position :", resp);
      let location = {
        "longitude": resp.coords.longitude,
        "latitude": resp.coords.latitude,
        "start": self.page
      }
      self.userService.getNearByVendor(location, self.loggedinUser["secretToken"]).then((list: any) => {
        list = list.filter((i) => i.status=="Follow")
        if (list.length != 0) {
          for (var i = 0; i < list.length; i++) {
            self.vendorList.push(list[i]);
          }
          infiniteScroll.complete();
          if (self.vendorList.length > 90) {
            infiniteScroll.enable(false);
          }
        } else {
          infiniteScroll.enable(false);
        }
        self.vendorList.sort((a: any, b: any) => {
          if (a.distance.calculated < b.distance.calculated) {
            return -1;
          } else if (a.distance.calculated > b.distance.calculated) {
            return 1;
          } else {
            return 0;
          }
        });
      }).catch(err => {
        infiniteScroll.enable(false);
        console.log(err);
      });
    }).catch((error) => {
      this.isLocationAvl = false;
      console.log('Error getting location', error);
    });

  }
}
