import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { ModelReedemCodePage } from "../model-reedem-code/model-reedem-code";
import { ModelSaveCouponPage } from '../model-save-coupon/model-save-coupon';
import { ConfigServiceProvider } from '../../../providers/config-service/config-service';
import { VendorProvider } from '../../../providers/vendor/vendor';
import { User } from '../../../models/user';
import { CouponPaymentPage } from '../coupon-payment/coupon-payment';
import { BranchioProvider } from '../../../providers/branchio/branchio';
import { SocialSharing } from '@ionic-native/social-sharing';
import { UserServiceProvider } from '../../../providers/user-service/user-service';

/**
 * Generated class for the ModelCouponPopupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-model-coupon-popup',
  templateUrl: 'model-coupon-popup.html',
})
export class ModelCouponPopupPage {

  couponId;
  isTerm = true;
  storeDetails;
  couponDetails = {};
  loggedinUser = {};
  isSave = false;
  boxCount1 = [
    { isTrue: 0, isClick: 1 },
    { isTrue: 0, isClick: 1 },
    { isTrue: 0, isClick: 1 },
    { isTrue: 0, isClick: 1 },
    { isTrue: 0, isClick: 1 },
  ];
  boxCount2 = [
    { isTrue: 0, isClick: 1 },
    { isTrue: 0, isClick: 1 },
    { isTrue: 0, isClick: 1 },
    { isTrue: 0, isClick: 1 },
    { isTrue: 0, isClick: 1 },
  ];
  constructor(
    public viewCtrl: ViewController,
    public params: NavParams,
    public renderer: Renderer,
    public modalCtrl: ModalController,
    public config: ConfigServiceProvider,
    public vendor: VendorProvider,
    public branch: BranchioProvider,
    private socialSharing: SocialSharing,
    public userService: UserServiceProvider,
  ) {

    let self = this;
    this.couponDetails = self.params.get('coupon');
    this.isSave = self.params.get('isSave');
    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);

    }).catch((err) => {
      this.config.printLog("", err);
    });

    if (this.couponDetails["punch_count"] != undefined) {
      if (this.couponDetails["punch_count"] != 0) {
        if (this.couponDetails["punch_count"] <= 5) {
          for (let i = 0; i < this.couponDetails["punch_count"]; i++) {
            this.boxCount1[i].isTrue = 1;
          }
        }
        else {
          for (let i = 0; i < 5; i++) {
            this.boxCount1[i].isTrue = 1;
          }
          for (let j = 0; j < (this.couponDetails["punch_count"] - 5); j++) {
            this.boxCount2[j].isTrue = 1;
          }


        }
        if (this.couponDetails["punch_count"] >= 5) {
          this.boxCount2[this.couponDetails["punch_count"] - 5].isClick = 0;
        }
        else {
          this.boxCount1[this.couponDetails["punch_count"]].isClick = 0;
        }
      } else if (this.couponDetails["punch_count"] == 0) {
        this.boxCount1[this.couponDetails["punch_count"]].isClick = 0;
      }
    }


    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
  }
  isClicked(i, index) {
    if (!i.isClick) {
      i['isTrue'] = !i['isTrue'];
    }
  }

  getClass(isTrue) {
    if (isTrue) {
      return 'box-blue';
    }
    return 'box';
  }
  dismiss() {
    this.viewCtrl.dismiss({ 'isSave': this.isSave, 'count': this.couponDetails["punch_count"] });
  }
  goToReedemCode() {
    if (this.couponDetails["discount_type"] == 'Dollar Amount' && !this.couponDetails["payment"] && this.couponDetails["qupey_type"] != 'No Fee') {
      let paymentDetails = {
        amount: this.couponDetails["purchase_amount"],
        coupon_id: this.couponDetails["coupon_id"],
        vendor_id: this.couponDetails["vendor_id"],
        coupon_name: this.couponDetails["coupon_name"],
        vendor_name: this.couponDetails["vendorname"],
        user_name: this.loggedinUser["username"],
        vendor_email: this.couponDetails["email"],
        user_email: this.loggedinUser["email"],
        available_amount: this.couponDetails["available_amount"]
      }
      let myModal = this.modalCtrl.create(CouponPaymentPage, { 'paymentDetails': paymentDetails }, { enableBackdropDismiss: false });
      myModal.onDidDismiss((params) => {
        this.couponDetails["payment"] = params.payment;
      })
      myModal.present();
    } else {
      this.dismiss();
      let myModal = this.modalCtrl.create(ModelReedemCodePage, { 'coupon': this.couponDetails }, { enableBackdropDismiss: false });
      myModal.present();

    }

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ModelCouponPopupPage', this.couponDetails, this.isSave);
  }
  showChange() {
    this.isTerm = !this.isTerm;
  }
  getCoupon(id, token) {
    let self = this;
    self.config.showLoading();
    console.log("this.couponId", id);
    self.vendor.getCoupon(id, token).then((response) => {
      self.couponDetails = response;
      console.log("", self.couponDetails);
      self.config.hideloading();
    }).catch(err => {
      self.config.hideloading();
      console.log(err);
    });
  }
  saveCoupon() {
    let self = this;
    self.config.showLoading();
    let param = {
      "coupon_id": self.couponDetails['_id'],
      "vendor_id": self.couponDetails['vendor_id']
    }

    self.vendor.saveCoupon(param, self.loggedinUser["secretToken"]).then((response) => {
      //fire event to disable save option

      let myModal = this.modalCtrl.create(ModelSaveCouponPage, { 'storeDetails': this.couponDetails, 'popIt': true }, { enableBackdropDismiss: false });
      myModal.onDidDismiss((params) => {
        if (params.isSave) {
          this.isSave = true;
        }
      })
      myModal.present();
      self.config.hideloading();
    }).catch(err => {
      self.config.hideloading();
      console.log(err);
    });
  }
  //share coupon 
  shareCoupon() {
    let self = this
    console.log("i am sharing ");
    let message = self.couponDetails["discription"]
    let coupon = self.couponDetails
    let subject = "Qupey Share"
    switch (coupon["discount_type"]) {
      case "Percentage":
        message = "Yaaay!!! " + self.loggedinUser["name"] + " shared a Qupey called \"" + coupon["qupey_type"] + "\" from " + self.couponDetails["vendorname"]
        subject = coupon["qupey_type"]
        break;
      case "Dollar Amount":
        message = "Yaaay!!! " + self.loggedinUser["name"] + " shared a Qupey called \"" + coupon["coupon_name"] + "\" from " + self.couponDetails["vendorname"]
        subject = coupon["coupon_name"]
        break;
      case "Punchcard":
        message = "Yaaay!!! " + self.loggedinUser["name"] + " shared a Qupey called \"" + coupon["qupey_type"] + "\" from " + self.couponDetails["vendorname"]
        subject = coupon["qupey_type"]
        break;
      case "Other":
        message = "Yaaay!!! " + self.loggedinUser["name"] + " shared a Qupey called \"" + coupon["coupon_name"] + "\" from " + self.couponDetails["vendorname"]
        subject = coupon["coupon_name"]
        break;
      default:
        message = "Yaaay!!! " + self.loggedinUser["name"] + " shared a Qupey called \"" + coupon["coupon_name"] + "\" from " + self.couponDetails["vendorname"]
        subject = coupon["coupon_name"]
        break;
    }

    let file = self.couponDetails["logo_url"]
    self.config.showLoading();
    self.branch.getSharedLink(self.couponDetails["_id"], self.loggedinUser["_id"], self.couponDetails["vendor_id"]).then((link) => {
      self.userService.saveLink({ couponId: self.couponDetails["_id"], vendorId: self.couponDetails["vendor_id"], link: link }, self.loggedinUser["secretToken"]).then((res) => {
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
