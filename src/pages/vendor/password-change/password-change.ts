import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { User } from "../../../models/user";
import { VendorProvider } from "../../../providers/vendor/vendor";
import { VendorHomePage } from "../../vendor-home/vendor-home";
import { UserServiceProvider } from "../../../providers/user-service/user-service";

/**
 * Generated class for the PasswordChangePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-password-change',
  templateUrl: 'password-change.html',
})
export class PasswordChangePage {
    public qupeyForm: FormGroup;
  loggedinUser;
  constructor(public navCtrl: NavController, public navParams: NavParams ,public viewCtrl: ViewController,params: NavParams,public renderer: Renderer, public config: ConfigServiceProvider, public vendor: VendorProvider,public actionSheetCtrl: ActionSheetController,public userService: UserServiceProvider) {

   this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
   let self = this;
    self.qupeyForm = new FormGroup({
      oldpassword: new FormControl('', [Validators.required]),
      newpassword: new FormControl('', [Validators.required]),
      confirmpassword: new FormControl('', [Validators.required]),
     });
     self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
      console.log("this.loggedinUser");
      console.log(self.loggedinUser);
      if (self.loggedinUser['verified'] == true || self.loggedinUser['type'] == "user") {
        //nothig
      }
      else {
        self.config.showAlert("You are not verifed");
        self.navCtrl.pop();
      }
    }).catch((err) => {
      this.config.printLog("", err);
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  save(data, isValid){
    let self  =this;
    if(isValid){
      if(data.newpassword != data.confirmpassword){
        self.config.showToast("new password and confirm password does not match");
      }else{
        self.userService.changePassword(data,self.loggedinUser["secretToken"]).then(result=>{
          self.config.showToast(result);
          self.dismiss();
        }).catch(err=>{

        })
      }
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordChangePage');
  }

}
