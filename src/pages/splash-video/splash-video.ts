import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OnBoardingSliderPage } from "../on-boarding-slider/on-boarding-slider";
import { RegistrationTypeSelectPage } from "../registration/registration-type-select/registration-type-select";
import { ConfigServiceProvider } from "../../providers/config-service/config-service";


/**
 * Generated class for the SplashVideoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-splash-video',
  templateUrl: 'splash-video.html',
})
export class SplashVideoPage {
  video
  videoMute=false;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
    public config : ConfigServiceProvider) {

  }

  continue(){
    let self=this;
   self.navCtrl.setRoot(OnBoardingSliderPage);
  }
  ionViewDidEnter() {
    console.log('ionViewDidLoad SplashVideoPage');
    this.video=(<HTMLInputElement>document.getElementById("myVideo"))
    console.log(this.video)
    // this.video.play().then(()=>{
    //   console.log("inside")
    // }).catch((err)=>{
    //   console.log("inside catch",err);
    // });
   //this.video.muted=false;
   console.log("videotag",this.video.muted)
  }
 toggleMute() {
    console.log("videotag",this.video.muted)
    this.video.muted=!this.video.muted;
    this.videoMute=!this.videoMute;
    
    }
 fallback(video)
    {
      console.log("coming error in playing video",video);
    }
}
