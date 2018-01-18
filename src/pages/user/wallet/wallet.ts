import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { UserServiceProvider } from '../../../providers/user-service/user-service';
import { ConfigServiceProvider } from '../../../providers/config-service/config-service';
import { User } from '../../../models/user';
import { VendorProvider } from '../../../providers/vendor/vendor';
import { ModelCouponPopupPage } from '../model-coupon-popup/model-coupon-popup';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BranchioProvider } from '../../../providers/branchio/branchio';


/**
 * Generated class for the WalletPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {
  loggedinUser = {};
  couponList = [];
  couponDetails = {};
  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController, public navParams: NavParams, public userService: UserServiceProvider,
    public config: ConfigServiceProvider,
    public vendor: VendorProvider, public events: Events,
    public branch: BranchioProvider,
    private socialSharing: SocialSharing) {
    let self = this;
    self.events.unsubscribe("redeemCoupon2");
    self.events.subscribe("redeemCoupon2", (params) => {
      self.couponList = self.couponList.filter((i) => i.coupon_id != params.coupon_id);
    });
    self.events.unsubscribe("punchCount");
    self.events.subscribe("punchCount", (params) => {
      console.log("inside punchCount");
      self.couponList.map((coupon) => {
        if (coupon.coupon_id == params.coupon_id) {
          coupon.punch_count = params.punch_count;
        }
        return coupon;
      })
    });
  }
  previous() {
    this.navCtrl.pop();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletPage');
  }
  ionViewDidEnter() {
    let self = this
    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
      self.getCoupon(this.loggedinUser["secretToken"]);
    }).catch((err) => {
      this.config.printLog("", err);
    });



  }
  openModalWithParams(coupon) {
    let self = this;

    let myModal = this.modalCtrl.create(ModelCouponPopupPage, { 'coupon': coupon, 'isSave': true }, { enableBackdropDismiss: false });

    myModal.present();


  }
  getCoupon(token) {
    let self = this;
    self.config.showLoading();
    self.vendor.getSaveCoupon(token).then((response) => {
      let coupons = response['data'].filter((co) => co.coupon_status == "publish");

      self.couponList = coupons;
      self.config.hideloading();
    }).catch(err => {
      self.config.hideloading();
      console.log(err);
    });
  }
  //share coupon 
  shareCoupon(coupon) {
    let self = this
    console.log("i am sharing ", coupon);
    let message = coupon.discription
    let subject = "Qupey Share"
    switch (coupon.discount_type) {
      case "Percentage":
        message = "Yaaay!!! " + self.loggedinUser["name"] + " shared a Qupey called \"" + coupon.qupey_type + "\" from " + coupon.vendorname
        subject = coupon.qupey_type
        break;
      case "Dollar Amount":
        message = "Yaaay!!! " + self.loggedinUser["name"] + " shared a Qupey called \"" + coupon.coupon_name + "\" from " + coupon.vendorname
        subject = coupon.coupon_name
        break;
      case "Punchcard":
        message = "Yaaay!!! " + self.loggedinUser["name"] + " shared a Qupey called \"" + coupon.qupey_type + "\" from " + coupon.vendorname
        subject = coupon.qupey_type
        break;
      case "Other":
        message = "Yaaay!!! " + self.loggedinUser["name"] + " shared a Qupey called \"" + coupon.coupon_name + "\" from " + coupon.vendorname
        subject = coupon.coupon_name
        break;
      default:
        message = "Yaaay!!! " + self.loggedinUser["name"] + " shared a Qupey called \"" + coupon.coupon_name + "\" from " + coupon.vendorname
        subject = coupon.coupon_name
        break;
    }

    let file = coupon.logo_url
    self.config.showLoading();
    self.branch.getSharedLink(coupon.coupon_id, self.loggedinUser["_id"], coupon.vendor_id).then((link) => {
      self.userService.saveLink({ couponId: coupon.coupon_id, vendorId: coupon.vendor_id, link: link }, self.loggedinUser["secretToken"]).then((res) => {
        self.socialSharing.share(message, subject, file, link.toString()).then((response) => {
          console.log("sharing", response);
          // this.config.showAlert(response)
          self.config.hideloading();
        }).catch((err) => {
          console.log(err);
        })
      }).catch((err2) => {
        console.log(err2);
      })

    }).catch((error) => {
      console.log(error);
    })

  }
}
