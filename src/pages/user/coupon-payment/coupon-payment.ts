import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { Stripe } from '@ionic-native/stripe';
import { VendorProvider } from "../../../providers/vendor/vendor";
import { User } from '../../../models/user';
import { UserServiceProvider } from '../../../providers/user-service/user-service';

/**
 * Generated class for the CouponPaymentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-coupon-payment',
  templateUrl: 'coupon-payment.html',
})
export class CouponPaymentPage {
  loggedinUser
  min
  max
  paymentDetails=[];
  cardtypes
  planTypes;
  selectOptions
  payment=false;
  public stripeForm: FormGroup;
  constructor(  public viewCtrl: ViewController,
    public navParams: NavParams,
    public config: ConfigServiceProvider,
    private stripe: Stripe,
  public userService:UserServiceProvider) {

    this.stripeForm = new FormGroup({
      cardType:new FormControl(''),
      cardHolder:new FormControl('', Validators.required),
      cardNumber: new FormControl('', Validators.required),
      expiry: new FormControl('', Validators.required),
      cardCVC: new FormControl('', Validators.required),
     
    });
    this.cardtypes=["Debit","Credit","Visa"];
    this.selectOptions = {
      title: 'Card Type',
    subTitle: 'Select your type',
      mode: 'md'
      };
     let minyear = new Date();
    this.min = minyear.getFullYear();
    let maxyear = new Date(minyear.setFullYear(minyear.getFullYear() + 12));
    this.max = maxyear.getFullYear();
    this.paymentDetails=this.navParams.get("paymentDetails");
    
    
    this.config.getLocalStore("LoggedUser").then((value) => {
      this.loggedinUser = new User(value);
     });
  }
previous(){
  this.viewCtrl.dismiss({"payment":this.payment});
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad CouponPaymentPage');
  }
  createPayment(data, isValid) {
    this.config.showLoading();
    let self=this;
    let exp = data.expiry.split("-");
    if (isValid) {
      this.stripe.setPublishableKey(this.config.get("PUBLIC_STRIPE_KEY"));
      let card = {
        number: data.cardNumber,
        expMonth: exp[1],
        expYear: exp[0],
        cvc: data.cardCVC
      }
      this.stripe.createCardToken(card)
        .then((token) => {
         
          let payment={
            'token':token['id'],
            'amount':this.paymentDetails["amount"]*100,
            'coupon_id':this.paymentDetails["coupon_id"],
            'vendor_id':this.paymentDetails["vendor_id"],
            'vendor_name':this.paymentDetails["vendor_name"],
            'coupon_name':this.paymentDetails["coupon_name"],
            'user_name':this.paymentDetails["user_name"],
            'vendor_email':this.paymentDetails["vendor_email"],
            'user_email':this.paymentDetails["user_email"],
            'available_amount':this.paymentDetails["available_amount"]-1
          }
           this.config.printLog("from stripe.chargeCreate", payment);
          this.userService.chargeCreate(payment,this.loggedinUser["secretToken"]).then((response)=>{
            self.config.printLog("from stripe.chargeCreate", response);
            self.payment=true;
            self.config.showToast(response);
            self.previous();
           
            self.config.hideloading();
           
          }).catch((error) => {
            console.error(error);
            self.config.hideloading();
          });
        })
        .catch((error) => {
          self.config.hideloading();
          self.config.showToast(error)
        });
    }
  }
}
