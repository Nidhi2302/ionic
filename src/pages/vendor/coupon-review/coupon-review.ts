import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events } from 'ionic-angular';
import { VendorProvider } from "../../../providers/vendor/vendor";
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { User } from "../../../models/user";
import { CreateCouponPage } from "../create-coupon/create-coupon";

/**
 * Generated class for the CouponReviewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-coupon-review',
  templateUrl: 'coupon-review.html',
})
export class CouponReviewPage {
  businessBack = "assets/business-image/VendorDefault.jpg";
  businessLogo = "assets/business-logo/user-default.png";
  loggedinUser = {};
  boxClick = true;
  couponId;
  couponTypeMsg;
  buttonText;
  coupon={};
  oldCoupon;
  boxCount1 = [
    { isTrue: 0 },
    { isTrue: 0 },
    { isTrue: 0 },
    { isTrue: 0 },
    { isTrue: 0 },
  ];
  boxCount2 = [
    { isTrue: 0 },
    { isTrue: 0 },
    { isTrue: 0 },
    { isTrue: 0 },
    { isTrue: 0 },
  ];
  constructor(public navCtrl: NavController,
    protected events:Events, public menuCtrl: MenuController, public navParams: NavParams, public config: ConfigServiceProvider,
    public vendor: VendorProvider) {
      let self = this
    this.config.getLocalStore("LoggedUser").then((value) => {
      this.loggedinUser = new User(value);
      console.log(this.loggedinUser);
      this.couponId = this.navParams.get("id");
      console.log("Coupon :", this.couponId, this.loggedinUser["secretToken"]);
      this.getCoupon(this.couponId);
    }).catch((err) => {
      console.log(err);
    });
     this.config.getLocalStore("profilePic").then((value) => {
      console.log(value);
      if(value){
        this.businessLogo = value;
      }

    },error=>{console.log("profile pic",error);}).catch((err) => {
      console.log(err);
    })
    this.events.subscribe("updateCoupon",(coupon)=>{
      self.oldCoupon=self.coupon;
      self.coupon = coupon;
      self.coupon['address1']=self.oldCoupon['address1'];
      self.coupon['address2']=self.oldCoupon['address2'];
      self.events.publish("passUpdatedCoupon",self.coupon);
    })
    
  }
  getCoupon(id) {
    let self = this;
    this.config.showLoading();
    self.vendor.getCoupon(id, self.loggedinUser["secretToken"]).then((coupon) => {
      self.coupon = coupon;
       self.config.printLog("coupon", coupon);
      self.config.hideloading();
    }).catch((err) => {
      self.config.hideloading();
      self.config.printLog("", err);
    })

  }
  previous() {
    let self =this;
    this.vendor.getCouponCount(this.loggedinUser["secretToken"]).then((res) => {
      this.config.printLog("coupon count", res);
      self.events.publish('resetForm',{isCouponAvl:true});
      this.config.hideloading();
      self.navCtrl.pop();
    }).catch((err) => {
      self.events.publish('resetForm',{isCouponAvl:false,msg:err});
      this.config.printLog("errejjer", err);
      this.config.hideloading();
      self.navCtrl.pop();
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CouponReviewPage');
  }
  isClicked(i, index) {
    i['isTrue'] = !i['isTrue'];
  }

  getClass(isTrue) {
    if (isTrue) {
      return 'box-blue';
    }
    return 'box';
  }
  publishCoupon(item){
    this.config.showLoading();
    let data={
      "id":item._id,
      "vendorId":item.vendorId,
      "coupon_status":"publish"
    }
    let self=this;
    // console.log("date compre",new Date(item.expiration_date)>new Date());
    // if(new Date(item.expiration_date)>new Date()){
      
      this.vendor.publishCoupon(data,self.loggedinUser['secretToken']).then((result)=>{
        self.config.showToast(result);
        self.config.hideloading();
        self.events.publish('publishCoupon',data);
        this.config.showLoading();
        this.vendor.getCouponCount(this.loggedinUser["secretToken"]).then((res) => {
          this.config.printLog("coupon count", res);
          self.events.publish('resetForm',{isCouponAvl:true});
          this.config.hideloading();
          self.navCtrl.pop();
        }).catch((err) => {
         
          self.events.publish('resetForm',{isCouponAvl:false,msg:err});
          this.config.printLog("errejjer", err);
          this.config.hideloading();
          self.navCtrl.pop();
        })
        
       
        
      }).catch(err=>{
        self.config.hideloading();
        console.log(err);
      })
    // }
    // else{
    //   this.config.showToast("Expired Coupon can't be published. Please update your coupon to publish");
    //   self.config.hideloading();
    // }
    
  }
  editCoupon(item){
    this.navCtrl.push(CreateCouponPage,{"coupon":item});
  }
}
