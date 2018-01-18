import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { Stripe } from '@ionic-native/stripe';
import { VendorProvider } from "../../../providers/vendor/vendor";
import { User } from "../../../models/user";
import { VendorHomePage } from "../../vendor-home/vendor-home";
import { StatisticsPage } from "../statistics/statistics";
import { ProfilePage } from "../profile/profile";


/**
 * Generated class for the StripePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-stripe',
  templateUrl: 'stripe.html'
})
export class StripePage {
  loggedinUser
  min
  max
  price
  cardtypes
  planTypes;
  selectOptions
  public stripeForm: FormGroup;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigServiceProvider,
    private stripe: Stripe,
  public vendor:VendorProvider) {

    this.stripeForm = new FormGroup({
      cardType:new FormControl(''),
      cardHolder:new FormControl('', Validators.required),
      cardNumber: new FormControl('', Validators.required),
      expiry: new FormControl('', Validators.required),
      cardCVC: new FormControl('', Validators.required),
      planType:new FormControl({'price':0.0}, Validators.required),
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
    this.price=this.config.get("AMOUNT");
    
    
    this.config.getLocalStore("LoggedUser").then((value) => {
      this.loggedinUser = new User(value);
      console.log("this.loggedinUser");
      console.log(this.loggedinUser);
      if (this.loggedinUser['verified'] == true) {
        this.vendor.getPlan(this.loggedinUser["secretToken"]).then((res)=>{
       this.config.printLog("plan list",res);
       this.planTypes=res;
     }).catch((err)=>{
      this.config.printLog("",err);
     })
      }
      else {
        this.config.showAlert("You are not verifed");
        this.navCtrl.pop();
      }
    });
  }
previous(){
  this.navCtrl.pop();
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad StripePage');
  }
  createPayment(data, isValid) {
    //console.log(this.config.get("PUBLIC_STRIPE_KEY"));
    this.config.showLoading();
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
            'plan':data.planType.plan
          }
           this.config.printLog("from stripe.createCardToken", payment);
          this.vendor.callStripe(payment,this.loggedinUser["secretToken"]).then((response)=>{
            this.config.printLog("from stripe.createCardToken", response);
            //console.log("payment");
            //console.log(response);
            this.config.showToast(response['message']);
            this.loggedinUser['isSubscribe']=response['isSubscribe'];
            this.loggedinUser['expiryDate']=response['expiryDate'];
            this.config.setLocalStore("LoggedUser",this.loggedinUser);
            this.config.hideloading();
            this.navCtrl.setRoot(ProfilePage);
            //this.navCtrl.setRoot(StatisticsPage);
          }).catch((error) => {
            console.error(error);
             this.config.hideloading();
          });
        })
        .catch((error) => {
           this.config.hideloading();
          this.config.showToast(error)
        });
    }
  }
}
