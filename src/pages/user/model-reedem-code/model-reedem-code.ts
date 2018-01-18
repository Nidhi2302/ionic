import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { UserServiceProvider } from '../../../providers/user-service/user-service';
import { ConfigServiceProvider } from '../../../providers/config-service/config-service';
import { User } from '../../../models/user';

/**
 * Generated class for the ModelReedemCodePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-model-reedem-code',
  templateUrl: 'model-reedem-code.html',
})
export class ModelReedemCodePage {

 coupon={};
 isTerm=true;
 redeemCode;
 loggedinUser={}
 public mask = [/[a-z,0-9,A-Z]/, '-', /[a-z,0-9,A-Z]/, '-', /[a-z,0-9,A-Z]/, '-', /[a-z,0-9,A-Z]/, '-', /[a-z,0-9,A-Z]/, '-', /[a-z,0-9,A-Z]/]
  constructor(
    public viewCtrl: ViewController,
    public params: NavParams,
    public renderer: Renderer,
    public userService:UserServiceProvider,
    public config:ConfigServiceProvider,
    public events:Events
  ) {
    let self = this;
    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
    }).catch((err) => {
      this.config.printLog("", err);
    });
    this.coupon = this.params.get('coupon');
     this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  redeemCoupon(){
    let self=this;
    if(this.redeemCode==this.coupon['redumption_code']){
      let redeemCoupon={
        "vendorId": self.coupon['vendor_id'],
        "couponId": self.coupon['coupon_id'],
        "coupon_type":self.coupon["discount_type"],
        "punch_count":self.coupon["punch_count"]+1,
        "actual_count":self.coupon["actual_count"],
        "sharedUser":self.coupon["user_shared"],
        "redeemer":self.loggedinUser["name"]
      };
      if(self.coupon["discount_type"]!= 'Dollar Amount' && self.coupon["discount_type"] != 'Other'){
        redeemCoupon["couponDec"]=self.coupon["qupey_type"];
      }
      else{
        redeemCoupon["couponDec"]=self.coupon["coupon_name"];
      }
      self.config.showLoading()
     this.userService.redeemCoupon(redeemCoupon,self.loggedinUser['secretToken']).then((response)=>{
      self.config.hideloading();
      if(self.coupon["discount_type"]=='Punchcard' && self.coupon["punch_count"]+1==self.coupon["actual_count"]+1){
        self.events.publish("redeemCoupon",{"coupon_id":self.coupon['coupon_id']});
        self.events.publish("redeemCoupon2",{"coupon_id":self.coupon['coupon_id']});
        self.events.publish("redeemCouponCount",{"vendorId":self.coupon["vendor_id"]});
        self.events.publish("redeemCouponCount2",{"vendorId":self.coupon["vendor_id"]});
      }
      else if(self.coupon["discount_type"]=='Punchcard' && self.coupon["punch_count"]+1!=self.coupon["actual_count"]+1){
        self.events.publish("punchCount",{"coupon_id":self.coupon['coupon_id'],"punch_count":self.coupon["punch_count"]+1});
        self.events.publish("punchCount2",{"coupon_id":self.coupon['coupon_id'],"punch_count":self.coupon["punch_count"]+1});
      }
      else if(self.coupon["discount_type"]!='Punchcard'){
        self.events.publish("redeemCoupon",{"coupon_id":self.coupon['coupon_id']});
        self.events.publish("redeemCoupon2",{"coupon_id":self.coupon['coupon_id']});
        self.events.publish("redeemCouponCount",{"vendorId":self.coupon["vendor_id"]});
        self.events.publish("redeemCouponCount2",{"vendorId":self.coupon["vendor_id"]});
      }
      
      self.config.showToast(response['message']);
      self.dismiss();
     }).catch((err)=>{
      self.config.hideloading();
      self.config.printLog("error",err)
     })
    }
    else{
      self.config.showToast("Redeem Code is incorrect");
      console.log("redeem fail");
    }
  }
  showChange(){
    this.isTerm=!this.isTerm;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ModelReedemCodePage',this.coupon);
  }

}
