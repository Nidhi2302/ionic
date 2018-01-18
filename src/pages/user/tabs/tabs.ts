import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { HomePage } from "../home/home";
import { UserServiceProvider } from "../../../providers/user-service/user-service";
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { LoginPage } from "../../login/login/login";
import { OnBoardingSliderPage } from "../../on-boarding-slider/on-boarding-slider";
import { StoreDetailPage } from "../store-detail/store-detail";
import { Geolocation } from '@ionic-native/geolocation';
import { User } from "../../../models/user";
// import { MapPage } from "../map/map";
import { MapViewPage } from "../map-view/map-view";
import { UserProfilePage } from "../user-profile/user-profile";
import { FavoritesPage } from "../favorites/favorites";
import { WalletPage } from "../wallet/wallet";
/**
 * Generated class for the TabsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
tab1=HomePage ;
loggedinUser;
vendorList;
tab2 = MapViewPage
tab5 = UserProfilePage
tab3= FavoritesPage
tab4=WalletPage
@ViewChild('myTabs') tabRef: Tabs;
  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserServiceProvider,
  public config: ConfigServiceProvider,
    private geolocation: Geolocation) {
    let self = this;
    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
      console.log("this.loggedinUser");
      console.log(self.loggedinUser);
    
    } ).catch((err) => {
      this.config.printLog("", err);
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
   // this.tabRef.select(0);
  }
  ionViewDidEnter() {
    this.tabRef.select(0);
  }
}
