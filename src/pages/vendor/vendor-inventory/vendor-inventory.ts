import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events, AlertController } from 'ionic-angular';
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { User } from "../../../models/user";
import { VendorProvider } from "../../../providers/vendor/vendor";
import { CouponReviewPage } from "../coupon-review/coupon-review";
/**
 * Generated class for the VendorInventoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-vendor-inventory',
  templateUrl: 'vendor-inventory.html',
})
export class VendorInventoryPage {

  loggedinUser = {};
  appType = 'current';

  currentCoupon = [];
  expiredCoupon = [];
  couponTypeMsg;
  businessLogo = "assets/business-logo/user-default.png";
  page = 1;
  currentCount = 0;
  expiryCount = 0;
  constructor(public navCtrl: NavController, 
    protected events: Events,
     public menu: MenuController, 
     public vendor: VendorProvider,
      public navParams: NavParams,
       public config: ConfigServiceProvider, 
       public alertCtrl: AlertController ) {
    let self = this;
    this.config.showLoading();
    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
      console.log("this.loggedinUser");
      console.log(self.loggedinUser);
      if (self.loggedinUser['verified'] == true) {
        //nothig
        self.current();
        self.expired();
        self.config.getLocalStore("profilePic").then((value) => {
          if (value) {
            this.businessLogo = value;
          }
          self.config.hideloading();
        }).catch((err) => {
          console.log(err);
        })
        
      }
      else {
        self.config.showAlert("You are not verifed");
        self.config.hideloading();
        self.navCtrl.pop();
      }
    }).catch((err) => {
      self.config.hideloading();
      this.config.printLog("", err);
    });

    this.events.subscribe('publishCoupon', data => {
      self.currentCoupon = self.currentCoupon.map((item) => {
        if (item._id == data.id) {
          item.coupon_status = "publish";
        }
        return item;
      })
      console.log("publish coupon event catch", self.currentCoupon);
    })
    this.events.subscribe('passUpdatedCoupon', data => {
      self.currentCoupon = self.currentCoupon.map((item) => {
        if (item._id == data._id) {
          item = data;
        }
        return item;
      })
    })
  }


  clickMenu() {
    let self = this;
    self.menu.open();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorInventoryPage');
  }
  current() {
    let self = this;

    self.vendor.getCurrentCoupon(self.loggedinUser["secretToken"], this.page,0).then((response) => {
      self.currentCoupon = response['data'];
      self.currentCount = response['count'];
      console.log(self.currentCoupon);
    }).catch(err => {
      console.log(err);
    });
  }


  expired() {
    let self = this;
    let page = 1;
    
    self.vendor.getExpiredCoupon(self.loggedinUser["secretToken"], page).then((response) => {
      if (response) {
        self.expiryCount = response['count'];
        self.expiredCoupon = response['data'];
      }
      console.log(self.currentCoupon);
    }).catch(err => {
      console.log(err);
    });
  }
  goToPreview(couponId) {
    this.navCtrl.push(CouponReviewPage, { "id": couponId });
  }
  doInfiniteCurrent(infiniteScroll) {
    let self = this;
    this.page = this.page + 1;
    self.vendor.getCurrentCoupon(self.loggedinUser["secretToken"], this.page,0).then((response) => {
      if (response['data'].length != 0) {
        for (var i = 0; i < response['data'].length; i++) {
          self.currentCoupon.push(response['data'][i]);
        }
        infiniteScroll.complete();
        if (self.currentCoupon.length > 90) {
          infiniteScroll.enable(false);
        }
      } else {
        infiniteScroll.enable(false);
      }

    }).catch(err => {
      infiniteScroll.enable(false);
      console.log(err);
    });


  }
  doInfiniteExpiry(infiniteScroll) {
    let self = this;
    this.page = this.page + 1;
    self.vendor.getExpiredCoupon(self.loggedinUser["secretToken"], this.page).then((response) => {
      if (response['data'].length != 0) {
        for (var i = 0; i < response['data'].length; i++) {
          self.expiredCoupon.push(response['data'][i]);
        }
        infiniteScroll.complete();
        if (self.expiredCoupon.length > 90) {
          infiniteScroll.enable(false);
        }
      } else {
        infiniteScroll.enable(false);
      }

    }).catch(err => {
      infiniteScroll.enable(false);
      console.log(err);
    });


  }
  deleteCoupon(id, type) {
    let self = this
    const alert = this.alertCtrl.create({
      message:"Are you sure, you want to delete?" ,
      title: "Alert",
      buttons: [{
        text:'Ok',
        handler:()=>{
          this.vendor.deleteCoupon(id, self.loggedinUser["secretToken"]).then((response) => {
            if (response) {
              if (type == "current") {
                self.currentCoupon = self.currentCoupon.filter((item) => item._id !== id);
                self.currentCount = self.currentCount - 1;
              }
              else {
                self.expiredCoupon = self.expiredCoupon.filter((item) => item._id !== id);
                self.expiryCount = self.expiryCount - 1;
              }
              //console.log("before deleted",self.currentCoupon);
      
              //console.log("after deleted",self.currentCoupon);
              self.config.showToast(response);
            }
          }).catch(err => {
            self.config.showToast(err);
            console.log(err);
          });
        }
      },
      {
      text:'Cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
       } ]
    });
    alert.present();
    
    

  }
}
