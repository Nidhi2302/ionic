import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ModelCouponPopupPage } from "../model-coupon-popup/model-coupon-popup";
import { UserServiceProvider } from "../../../providers/user-service/user-service";
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { User } from "../../../models/user";
import { ModelReedemCodePage } from "../model-reedem-code/model-reedem-code";
import { VendorProvider } from '../../../providers/vendor/vendor';
import { ModelSaveCouponPage } from '../model-save-coupon/model-save-coupon';
import { SocialSharing } from '@ionic-native/social-sharing'; 
import { BranchioProvider } from '../../../providers/branchio/branchio';
declare var google: any;
/**
 * Generated class for the StoreDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-store-detail',
  templateUrl: 'store-detail.html',
})
export class StoreDetailPage {
  storeDetails;
  status = {
    isFollow: true,
    isFav: true
  }
  myParam = '';
  loggedinUser;
  couponDetails={};
  phoneNum = "";
  shopStatus = "Closed";
  // videoUrl="";
  videoUrl: SafeResourceUrl;
  map: any;
  point: any;
  page=1;
  currentCoupon=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private domSanitizer: DomSanitizer,
    public modalCtrl: ModalController,
    public userService: UserServiceProvider,
    public config: ConfigServiceProvider,
    private events: Events,
    private geolocation: Geolocation,
    public platform: Platform,
  public vendor:VendorProvider,
  public branch:BranchioProvider,
  private socialSharing: SocialSharing) {
    let self = this;
    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
    
      self.current();
    }).catch((err) => {
      this.config.printLog("", err);
    });
    this.storeDetails = this.navParams.get("storeDetails");
    this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.storeDetails.video_url);
    if(this.storeDetails.businessPhone!=null){
      this.phoneNum = "(" + this.storeDetails.businessPhone.substr(0, 3) + ") " + this.storeDetails.businessPhone.substr(3, 3) + "-" + this.storeDetails.businessPhone.substr(6, 4);      
    }

    //workingHours logic
    let currentTime = new Date();
    let closingTime = new Date();
    if(this.storeDetails.weekhours){
      if (currentTime.getDay() == 0) {
        if (this.storeDetails.weekhours[6].status == "Open") {
          closingTime.setHours(this.storeDetails.weekhours[6].close.split(":")[0]);
          closingTime.setMinutes(this.storeDetails.weekhours[6].close.split(":")[1]);
          if (currentTime < closingTime) {
            this.shopStatus = "Open untill " + this.tConvert(this.storeDetails.weekhours[6].close);
          }
        }
      }
      else {
        if (this.storeDetails.weekhours[currentTime.getDay() - 1].status == "Open") {
          closingTime.setHours(this.storeDetails.weekhours[currentTime.getDay() - 1].close.split(":")[0]);
          closingTime.setMinutes(this.storeDetails.weekhours[currentTime.getDay() - 1].close.split(":")[1]);
          if (currentTime < closingTime) {
            this.shopStatus = "Open untill " + this.tConvert(this.storeDetails.weekhours[currentTime.getDay() - 1].close);
          }
        }
      }
    }
    
  self.events.unsubscribe("redeemCoupon");
  self.events.subscribe("redeemCoupon",(params)=>{
    self.currentCoupon=self.currentCoupon.filter((i)=>i._id!=params.coupon_id);
    console.log("after filter",self.currentCoupon);
    //self.events.publish("redeemCouponCount",{"vendorId":self.storeDetails.vendor_id});
  });
  self.events.unsubscribe("punchCount2");
  self.events.subscribe("punchCount2",(params)=>{
    console.log("inside punchCount2");
    self.currentCoupon.map((coupon)=>{
      if(coupon.coupon_id==params.coupon_id){
        coupon.punch_count=params.punch_count;
      }
      return coupon;
    })
  });
  }
  openMap(place) {
    this.geolocation.getCurrentPosition().then((position) => {
      // ios
      if (this.platform.is('ios')) {
        console.log("platform ios");
        window.open('maps://?q=' + name + '&saddr=' + position.coords.latitude + ',' + position.coords.longitude + '&daddr=' + place.lat + ',' + place.lng, '_system');
      };
      // android
      if (this.platform.is('android')) {
        window.open('geo://' + position.coords.latitude + ',' + position.coords.longitude + '?q=' + place.lat + ',' + place.lng + '(' + name + ')', '_system');
      };
    });

  }
  tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad StoreDetailPage');
    let self=this;
    //map section
     self.point = { lat: self.storeDetails.distance.location[1], lng: self.storeDetails.distance.location[0] };
    let divMap = (<HTMLInputElement>document.getElementById('smallMap'));
    self.map = new google.maps.Map(divMap, {
      center: self.point,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      draggable: false,
      zoomControl: true
    });
    var marker = new google.maps.Marker({
      map: this.map,
      position: self.point,
      icon: 'assets/MapPin/shape8.png'
    });

  }
  previous() {
    this.navCtrl.pop();

  }
  setFollow(status, item, type) {

    this.storeDetails.state[status] = !this.storeDetails.state[status];
    this.config.showLoading();
    let follow_value
    let param
    let self = this
    if (type == "like") {

      param = {
        "vendorId": item.vendor_id,
        "like": this.storeDetails.state[status]
      }
    }
    else if (type == "follow") {
      if (this.storeDetails.state[status]) {
        follow_value = "Follow"
      } else {
        follow_value = "Unfollow"
      }
      param = {
        "vendorId": item.vendor_id,
        "status": follow_value
      }
    }
    this.userService.setFollow(param, this.loggedinUser["secretToken"]).then((res) => {
      self.config.showToast(item.vendorname + " " + res);
      self.config.hideloading();
      if (type == "like") {
        self.events.publish("changeStatus", { "vendorId": item.vendor_id, "like": this.storeDetails.state[status] });
        self.events.publish("changeStatus2", { "vendorId": item.vendor_id, "like": this.storeDetails.state[status] });
      } else {
        self.events.publish("changeStatus", { "vendorId": item.vendor_id, "status": follow_value });
        self.events.publish("changeStatus2", { "vendorId": item.vendor_id, "status": follow_value });

      }
    }).catch((err) => {
      self.config.hideloading();
      self.config.printLog("", err);
    });
  }
  openModalWithParams(coupon) {
    let self=this;
    //self.config.showLoading();
    //console.log("this.couponId",id);
    // self.vendor.getCoupon(coupon._id,self.loggedinUser['secretToken']).then((response) => {
    //  self.couponDetails=response;
    coupon["address1"]=self.storeDetails.address1;
    coupon["address2"]=self.storeDetails.address2;
    coupon["logo_url"]=self.storeDetails.logo_url;
    coupon["vendorname"]=self.storeDetails.vendorname;
    coupon["vendor_id"]=self.storeDetails.vendor_id;
    coupon["email"]=self.storeDetails.email;
    coupon["coupon_id"]=coupon._id;
    coupon["user_shared"]=(coupon.user_shared==undefined) ? "":coupon.user_shared
    // if(self.loggedinUser["_id"]!=coupon["user_punch_count"]){
    //   coupon["punch_count"]=0;
    // }
     let myModal = this.modalCtrl.create(ModelCouponPopupPage, { 'coupon': coupon,'isSave':(coupon.saved!=0)  },{enableBackdropDismiss:false});
     myModal.onDidDismiss((params)=>{
       console.log(params);
       if(params.isSave){
         self.currentCoupon=self.currentCoupon.map((co)=>{
           if(co._id==coupon._id){
             co.saved=1;
           }
           return co
          })
       }
     })
     
     myModal.present();
    
    
 
  
  }
  current() {
    let self = this;
    self.config.showLoading();
    self.vendor.getCurrentCoupon(self.loggedinUser["secretToken"], this.page,self.storeDetails.vendor_id).then((response) => {
      response['data']=response['data'].filter((co)=>co.coupon_status=="publish");
      response['data']=response['data'].filter((co)=>{
        if(co.available_to[0]=="All Followers"){
          return true;
        }
        else{
          let return_value;
          co.available_to.forEach((cou)=>{
            console.log(cou.userId==self.loggedinUser["_id"]);
            return_value=cou.userId==self.loggedinUser["_id"];
            if(return_value){return}
          });
          return return_value;
        }
      });
      console.log("filtered",response['data']);
      self.currentCoupon = response['data'];
      if(this.navParams.get("couponId")){
        let item=this.currentCoupon.filter((c)=>c._id==this.navParams.get("couponId"));
        item[0]["user_shared"]=this.navParams.get("userId");
        this.openModalWithParams(item[0]);
      }
      self.config.hideloading();
    }).catch(err => {
      self.config.hideloading();
      console.log(err);
    });
  }
  doInfiniteCurrent(infiniteScroll) {
    let self = this;
    this.page = this.page + 1;
    self.vendor.getCurrentCoupon(self.loggedinUser["secretToken"], this.page,self.storeDetails.vendor_id).then((response) => {
      let couponList=response['data'].filter((co)=>co.coupon_status=="publish");
      couponList=couponList.filter((co)=>{
        if(co.available_to[0]=="All Followers"){
          return true;
        }
        else{
          let return_value;
          co.available_to.forEach((cou)=>{
            console.log(cou.userId==self.loggedinUser["_id"]);
            return_value=cou.userId==self.loggedinUser["_id"];
            if(return_value){return}
          });
          return return_value;
        }
      });
      if (couponList.length != 0) {
        for (var i = 0; i < couponList.length; i++) {
          self.currentCoupon.push(couponList[i]);
        }
        infiniteScroll.complete();
        if (self.currentCoupon.length > 90) {
          infiniteScroll.enable(false);
        }
      } else {
        infiniteScroll.enable(false);
      }

    }).catch(err => {
      infiniteScroll.enable(false);
      console.log(err);
    });


  }
  saveCoupon(coupon){
    let self = this;
    self.config.showLoading();
    let param={
      "coupon_id":coupon._id,
      "vendor_id":self.storeDetails.vendor_id
    }
    // let myModal = this.modalCtrl.create(ModelSaveCouponPage, { 'storeDetails': this.storeDetails },{enableBackdropDismiss:false});
    // myModal.present();
    self.vendor.saveCoupon(param,self.loggedinUser["secretToken"]).then((response) => {
     //self.config.showToast(response["message"]);
     self.currentCoupon=self.currentCoupon.map((co)=>{
      if(co._id==coupon._id){
        co.saved="saved";
      }
      return co
     })
     let myModal = this.modalCtrl.create(ModelSaveCouponPage, { 'storeDetails': this.storeDetails,'coupon':coupon },{enableBackdropDismiss:false});
     myModal.present();
      self.config.hideloading();
    }).catch(err => {
      self.config.hideloading();
      console.log(err);
    });
  }

  //share coupon 
  shareCoupon(coupon){
    let self=this
    let message=coupon.discription;
    let subject="Qupey Share"
    console.log("i am sharing ",coupon);
    switch (coupon.discount_type) {
      case "Percentage":
      message="Yaaay!!! "+self.loggedinUser["name"]+" shared a Qupey called \""+coupon.qupey_type+"\"\" from "+self.storeDetails.vendorname
      subject=coupon.qupey_type;
          break;
      case "Dollar Amount":
      message="Yaaay!!! "+self.loggedinUser["name"]+" shared a Qupey called \""+coupon.coupon_name+"\" from "+self.storeDetails.vendorname
      subject=coupon.coupon_name;
          break;
      case "Punchcard":
      message="Yaaay!!! "+self.loggedinUser["name"]+" shared a Qupey called \""+coupon.qupey_type+"\" from "+self.storeDetails.vendorname
      subject=coupon.qupey_type;
          break;
      case "Other":
      message="Yaaay!!! "+self.loggedinUser["name"]+" shared a Qupey called \""+coupon.coupon_name+"\" from "+self.storeDetails.vendorname
      subject=coupon.coupon_name;
          break;
      default:
      message="Yaaay!!! "+self.loggedinUser["name"]+" shared a Qupey called \""+coupon.coupon_name+"\" from "+self.storeDetails.vendorname
      subject=coupon.coupon_name;
          break;
  }
    
    
    let file="testing share"
    self.config.showLoading();
    console.log(message);
    self.branch.getSharedLink(coupon._id,self.loggedinUser["_id"],self.storeDetails.vendor_id).then((link)=>{
      self.userService.saveLink({couponId:coupon._id,vendorId:self.storeDetails.vendor_id,link:link},self.loggedinUser["secretToken"]).then((res)=>{
        self.socialSharing.share(message, subject,self.storeDetails.logo_url, link.toString()).then((response)=>{
          console.log("sharing",response);
         // this.config.showAlert(response)
         self.config.hideloading();
        }).catch((err)=>{
          self.config.hideloading();
          console.log(err);
        })
      }).catch((err2)=>{
        self.config.hideloading();
        console.log(err2);
      })
      
    }).catch((error)=>{
      self.config.hideloading();
      console.log(error);
    })
   
  }

}
