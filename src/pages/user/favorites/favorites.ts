import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UserServiceProvider } from "../../../providers/user-service/user-service";
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { LoginPage } from "../../login/login/login";
import { OnBoardingSliderPage } from "../../on-boarding-slider/on-boarding-slider";
import { StoreDetailPage } from "../store-detail/store-detail";
import { Geolocation } from '@ionic-native/geolocation';
import { User } from "../../../models/user";


/**
 * Generated class for the FavoritesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {

  isTrue = true;
  loggedinUser;
  vendorList = [];
  isLike = false;
  simpleVendorList = [];
  isLocationAvl = false;
  page = 1
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserServiceProvider,
    public config: ConfigServiceProvider,
    private geolocation: Geolocation,
    private events: Events) {
    let self = this;
    let lat = 23.064154;
    let lng = 72.530924;

    // self.config.getLocalStore("LoggedUser").then((value) => {
    //   self.loggedinUser = new User(value);
    //   self.getNearByVendor(this.page);
    // }).catch((err) => {
    //   this.config.printLog("", err);
    // });
    this.events.unsubscribe("changeStatus2")
    this.events.subscribe("changeStatus2", (vendor) => {
      self.vendorList = self.vendorList.map((v) => {
        if (v.vendor_id == vendor.vendorId) {
          if (vendor.status) {
            v.status = vendor.status;
          }
          else {
            v.like = vendor.like;
          }
        }
        return v
      })
      if (vendor.vendorList) {
        self.simpleVendorList = vendor.vendorList;
      }
      else {
        self.simpleVendorList = self.vendorList;
      }
      self.vendorList = self.simpleVendorList.filter((i) => i.like)
      console.log(" self.vendorList2", self.vendorList);
      console.log(" self.simpleVendorList", self.simpleVendorList);
    })
    this.events.unsubscribe("redeemCouponCount2");
    this.events.subscribe("redeemCouponCount2",(params)=>{
      self.vendorList = self.vendorList.map((v) => {
        if (v.vendor_id == params.vendorId) {
          v.couponcount =v.couponcount-1 ;
        }
        return v;
      })
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
      self.userService.getNearByVendor(location, self.loggedinUser["secretToken"]).then((list: any) => {
        self.config.printLog("vendor list", list);
        list.sort((a: any, b: any) => {
          if (a.distance.calculated < b.distance.calculated) {
            //a is the Object and args is the orderBy condition (data.likes.count in this case)
            return -1;
          } else if (a.distance.calculated > b.distance.calculated) {
            return 1;
          } else {
            return 0;
          }
        });
        self.getNearByVendorCouponCount(start);
        self.simpleVendorList = list;
        list = list.filter((i) => i.like)
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
  getNearByVendorCouponCount(start) {
    //this.config.showLoading();
    let self = this;
    self.geolocation.getCurrentPosition().then((resp) => {
      this.isLocationAvl = true;
      self.config.printLog("current position :", resp);
      let location = {
        "longitude": resp.coords.longitude,
        "latitude": resp.coords.latitude,
        "start": start
      }
      self.userService.getNearByVendorCouponCount(location, self.loggedinUser["secretToken"]).then((list: any) => {
        self.config.printLog("vendor list count", list);
        list.map((i) => {
          self.vendorList = self.vendorList.map((j) => {
            if (j.vendor_id == i._id) {
              j.couponcount = i.couponCount;
            }
            return j
          })
          return i
        })
        //this.config.hideloading();
      }).catch((err) => {
        self.config.printLog("vendor list", Object.keys(self.vendorList).length);
        //this.config.hideloading();
        self.config.printLog("", err);
      })
    }).catch((error) => {
      this.isLocationAvl = false;
      console.log('Error getting location', error);
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritesPage');
  }
  ionViewWillEnter() {
    let self=this;
    console.log('ionViewDidLoad FavoritesPage');
    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
      self.getNearByVendor(this.page);
    }).catch((err) => {
      this.config.printLog("", err);
    });
  }
  
 
  expCard(item) {
    this.vendorList.forEach((v)=>{
      if(v._id!=item._id){
        v.isExpandable=true;
      }
    })
    item.isExpandable = !item.isExpandable;
    if(item.isExpandable){
      this.goToStore(item);
      item.isExpandable = !item.isExpandable;
    }
  }
  getClass(item) {
    if (item.isExpandable) {
      return 'vendor-card-close';
    }
    return 'vendor-card';
  }
  goToStore(item) {
    let state
    if (item.status == "Follow") {
      state = {
        isFollow: true,
        isFav: item.like
      }
    }
    else {
      state = {
        isFollow: false,
        isFav: item.like
      }
    }

    item["state"] = state;
    this.navCtrl.push(StoreDetailPage, { "storeDetails": item });
  }
  setFav(item) {
    let self = this
    item.like = !item.like;
    //this.config.showLoading();
    let param = {
      "vendorId": item.vendor_id,
      "like": item.like
    }

    this.userService.setFollow(param, this.loggedinUser["secretToken"]).then((res) => {
      self.config.showToast(item.vendorname + " " + res);
      self.events.publish("changeStatus", { "vendorId": item.vendor_id, "like": item.like });
      self.events.publish("changeStatus2", { "vendorId": item.vendor_id, "like": item.like });
      self.config.hideloading();
    }).catch((err) => {
      self.config.hideloading();
      self.config.printLog("", err);
    });
  }
  doInfiniteExpiry(infiniteScroll) {
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
        list = list.filter((i) => i.like)
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
        self.userService.getNearByVendorCouponCount(location, self.loggedinUser["secretToken"]).then((list: any) => {
          self.config.printLog("vendor list count", list);
          list.map((j) => {
          self.vendorList = self.vendorList.map((i) => {
           if (i.vendor_id == j.vendorId) {
                i.couponcount = j.coupondetails.length
              }
            return i
          })
        })
          //this.config.hideloading();
        }).catch((err) => {
          self.config.printLog("vendor list", Object.keys(self.vendorList).length);
          //this.config.hideloading();
          self.config.printLog("", err);
        })
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
