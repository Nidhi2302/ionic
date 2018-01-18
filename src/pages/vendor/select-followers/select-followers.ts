import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { VendorProvider } from "../../../providers/vendor/vendor";
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { User } from "../../../models/user";

/**
 * Generated class for the SelectFollowersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-select-followers',
  templateUrl: 'select-followers.html',
})
export class SelectFollowersPage {
followersList=[]
searchFollowersList=[]
selectedFollowers=[]
loggedinUser
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public viewCtrl: ViewController,
     public renderer: Renderer,
     public config:ConfigServiceProvider, public vendor: VendorProvider
    ) {
      let self=this
      this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
      
      this.selectedFollowers=this.navParams.get("selectedFollowers");
      this.followersList=this.navParams.get("followersList");
      console.log("before checked list",this.selectedFollowers);
     this.followersList.forEach((item)=>{
        self.selectedFollowers.forEach((selected)=>{
          console.log(selected._id,item._id);
          if(selected._id==item._id){
            item["checked"]=true;
          }
          
        })
        
      })
      this.searchFollowersList=this.followersList;
      console.log("checked list",this.followersList);
  }

  setFollowers() {
    console.log(this.selectedFollowers);
    this.viewCtrl.dismiss(this.selectedFollowers);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectFollowersPage');
  }
  updateCbValue(user,event){
    //console.log("checked ",event);
    if(event.checked){
      user["checked"]=event.checked;
      this.selectedFollowers.push(user);
    }
    else{
      this.selectedFollowers=this.selectedFollowers.filter((item) => item._id !== user._id);
    }
    console.log("checked ",this.selectedFollowers);
  }
  filterItems(ev: any) {
    this.followersList=this.searchFollowersList;
    let val = ev.target.value;
    if (val && val.trim() !== '') {
      this.followersList = this.followersList.filter(function(item) {
        return item.name.toLowerCase().includes(val.toLowerCase());
      });
    }
  }
}
