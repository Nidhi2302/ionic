import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { VendorProvider } from "../../../providers/vendor/vendor";
import { User } from "../../../models/user";
import { StripePage } from "../stripe/stripe";

/**
 * Generated class for the MembershipPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-membership',
  templateUrl: 'membership.html',
})
export class MembershipPage {
  planDescription;
  getPlanName;
  subscriptionPlans = {};
  loggedinUser = {};
  expiryDate;
  businessBack = "assets/business-image/VendorDefault.jpg";
  businessLogo = "assets/business-logo/user-default.png";
  planTypes;
  getPlan;
  CurrentplanTypes;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public menuCtrl: MenuController, public navParams: NavParams, public config: ConfigServiceProvider,
    public vendor: VendorProvider) {
    this.config.getLocalStore("LoggedUser").then((value) => {
      this.loggedinUser = new User(value);
      console.log("this.loggedinUser");
      console.log(this.loggedinUser);
      if (this.loggedinUser['verified'] == true) {
        //nothig
        this.config.showLoading();
        this.vendor.getUserPlan(this.loggedinUser["secretToken"]).then((res)=>{
           this.config.printLog("plan list",res);
           this.getPlanName = res['cureentPlan'].plan_name;
           this.planDescription = res['cureentPlan'].description;
           this.planTypes = res['plans'];
           this.config.hideloading();
         }).catch((err)=>{
          this.config.hideloading();
          this.config.printLog("",err);
        })

      }
      else {
        this.config.showAlert("You are not verifed");
        this.navCtrl.pop();
      }
    }).catch((err) => {
      console.log(err);
    });
    this.config.getLocalStore("profilePic").then((value) => {
      if(value){
        this.businessLogo=value;
      }

    }).catch((err) => {
      console.log(err);
    })
    this.config.getLocalStore("backgroundPic").then((value) => {
      if(value){
        this.businessBack=value;
      }
      }).catch((err) => {
      console.log(err);
    })
  }
clickMenu() {
    console.log("menuClicked");
    this.menuCtrl.open();
  }
  gotoStripe(){
    this.navCtrl.push(StripePage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad MembershipPage');
  }
  cancelSub(){
    let self = this;
    self.config.showLoading();
    const alert = this.alertCtrl.create({
      message:"Are you sure, you want to cancel your subscription?" ,
      title: "Alert",
      buttons: [{
        text:'Ok',
        handler:()=>{
          self.vendor.cancelUserPlan(self.loggedinUser["secretToken"]).then((res)=>{
            self.config.hideloading();
            self.config.showToast(res['message']);
          }).catch((err)=>{
              self.config.hideloading();
              self.config.printLog("",err);
          })
        }
      },
      {
      text:'Cancel',
      handler: () => {
        self.config.hideloading();
        console.log('Cancel clicked');
      }
       } ]
    });
    alert.present();
   
  }
  changePlan(plan){
    console.log(plan);
    let self = this;
     self.config.showLoading();
     let plans = {
        "plan":plan
     }
     self.config.printLog("plan list",plans);
     const alert = this.alertCtrl.create({
      message:"Are you sure, you want to change your plan?" ,
      title: "Alert",
      buttons: [{
        text:'Ok',
        handler:()=>{
          self.vendor.updateUserPlan(self.loggedinUser["secretToken"],plans).then((res)=>{
            self.config.hideloading();
            self.vendor.getUserPlan(self.loggedinUser["secretToken"]).then((results)=>{
                self.config.printLog("plan list",results);
                self.getPlanName = results['cureentPlan'].plan_name;
                self.planDescription = results['cureentPlan'].description;
                self.planTypes = results['plans'];
                self.config.hideloading();
                self.config.showToast(res['message']);
              }).catch((err)=>{
                self.config.hideloading();
                self.config.printLog("",err);
              })
          }).catch((err)=>{
              self.config.hideloading();
              self.config.printLog("",err);
          })
        }
      },
      {
      text:'Cancel',
      handler: () => {
        self.config.hideloading();
        console.log('Cancel clicked');
      }
       } ]
    });
    alert.present();
     
  }



}
