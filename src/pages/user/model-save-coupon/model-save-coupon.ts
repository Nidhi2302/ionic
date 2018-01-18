import { Component, ViewChild, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController, ModalController } from 'ionic-angular';
import { UserServiceProvider } from '../../../providers/user-service/user-service';
import { ConfigServiceProvider } from '../../../providers/config-service/config-service';
import { User } from '../../../models/user';
import { ModelCouponPopupPage } from '../model-coupon-popup/model-coupon-popup';
import { VendorProvider } from '../../../providers/vendor/vendor';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BranchioProvider } from '../../../providers/branchio/branchio';



/**
 * Generated class for the ModelSaveCouponPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-model-save-coupon',
  templateUrl: 'model-save-coupon.html',
})
export class ModelSaveCouponPage {
  storedetails = {};
  coupon;
  popIt;
  couponDetails = {};
  loggedinUser = {};
  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController, public viewCtrl: ViewController, public navParams: NavParams,
    public renderer: Renderer, public vendor: VendorProvider, public config: ConfigServiceProvider, public branch: BranchioProvider,
    private socialSharing: SocialSharing,
    public userService: UserServiceProvider) {
    this.storedetails = this.navParams.get("storeDetails");
    this.coupon = this.navParams.get("coupon");
    this.popIt = this.navParams.get("popIt");
    this.config.getLocalStore("LoggedUser").then((value) => {
      this.loggedinUser = new User(value);

    }).catch((err) => {
      this.config.printLog("", err);
    });
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModelSaveCouponPage');
  }
  dismiss() {
    console.log("dismiss");
    if (this.popIt) {
      this.viewCtrl.dismiss({ 'isSave': true });
    } else {
      this.viewCtrl.dismiss();
    }
  }
  viewCoupon() {
    let self = this;
    if (this.popIt) {
      this.viewCtrl.dismiss({ 'isSave': true });
    } else {
      self.config.showLoading();
      self.vendor.getCoupon(self.coupon._id, self.loggedinUser['secretToken']).then((response) => {
        self.couponDetails = response;
        self.viewCtrl.dismiss();
        let myModal = this.modalCtrl.create(ModelCouponPopupPage, { 'coupon': self.couponDetails, 'isSave': true }, { enableBackdropDismiss: false });
        myModal.present();

        self.config.hideloading();
      }).catch(err => {
        self.config.hideloading();
        console.log(err);
      });
    }


  }
  //share coupon 
  shareCoupon() {
    let self = this
    console.log("i am sharing ");
    let message = self.coupon.discription
    let subject = "Qupey Share"
    switch (self.coupon.discount_type) {
      case "Percentage":
        message = "Yaaay!!! " + self.loggedinUser["name"] + " shared a Qupey called \"" + self.coupon.qupey_type + "\" from " + self.storedetails["vendorname"]
        subject = self.coupon.qupey_type
        break;
      case "Dollar Amount":
        message = "Yaaay!!! " + self.loggedinUser["name"] + " shared a Qupey called \"" + self.coupon.coupon_name + "\" from " + self.storedetails["vendorname"]
        subject = self.coupon.coupon_name
        break;
      case "Punchcard":
        message = "Yaaay!!! " + self.loggedinUser["name"] + " shared a Qupey called \"" + self.coupon.qupey_type + "\" from " + self.storedetails["vendorname"]
        subject = self.coupon.qupey_type
        break;
      case "Other":
        message = "Yaaay!!! " + self.loggedinUser["name"] + " shared a Qupey called \"" + self.coupon.coupon_name + "\" from " + self.storedetails["vendorname"]
        subject = self.coupon.coupon_name
        break;
      default:
        message = "Yaaay!!! " + self.loggedinUser["name"] + " shared a Qupey called \"" + self.coupon.coupon_name + "\" from " + self.storedetails["vendorname"]
        subject = self.coupon.coupon_name
        break;
    }

    let file = self.storedetails["logo_url"]
    self.config.showLoading();
    self.branch.getSharedLink(self.coupon._id, self.loggedinUser["_id"], self.storedetails["vendor_id"]).then((link) => {
      self.userService.saveLink({ couponId: self.coupon._id, vendorId: self.storedetails["vendor_id"], link: link }, self.loggedinUser["secretToken"]).then((res) => {
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
